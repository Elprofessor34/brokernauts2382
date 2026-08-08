"use client";

import { useCallback, useMemo, useState } from "react";
import {
  useAccount,
  useConfig,
  useReadContract,
  useReadContracts,
  useWriteContract,
} from "wagmi";
import { waitForTransactionReceipt } from "wagmi/actions";
import { encodeFunctionData, type Address } from "viem";
import { erc20Abi, mintAbi } from "./abi";
import { MINT, SPCX, MINT_LIVE } from "./contracts";
import { robinhoodChain } from "./chain";

export type MintStatus =
  | "idle"
  | "approving"
  | "minting"
  | "confirming"
  | "success"
  | "error";

/**
 * Wallets expose atomic batching through EIP-5792 (`wallet_sendCalls`), which
 * modern wallets implement on top of EIP-7702 delegation. We feature-detect it
 * rather than assuming: if the wallet supports it, approve+mint land in one
 * signature; if not, we fall back to the conventional two-step flow.
 *
 * Detection uses the raw EIP-1193 provider so this does not depend on any
 * experimental library surface that may move between versions.
 */
async function supportsAtomicBatch(provider: any, account: Address, chainId: number) {
  try {
    const caps = await provider.request({
      method: "wallet_getCapabilities",
      params: [account],
    });
    const hex = `0x${chainId.toString(16)}`;
    const forChain = caps?.[hex] ?? caps?.[chainId];
    const status =
      forChain?.atomic?.status ?? forChain?.atomicBatch?.supported ?? false;
    return status === true || status === "supported" || status === "ready";
  } catch {
    return false;
  }
}

export function useMint() {
  const { address, connector, chainId } = useAccount();
  const config = useConfig();
  const { writeContractAsync } = useWriteContract();

  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<MintStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const enabled = MINT_LIVE;

  const { data: sale, refetch: refetchSale } = useReadContracts({
    query: { enabled, refetchInterval: 12_000 },
    contracts: [
      { address: MINT, abi: mintAbi, functionName: "totalSupply" },
      { address: MINT, abi: mintAbi, functionName: "maxSupply" },
      { address: MINT, abi: mintAbi, functionName: "pricePerToken" },
      { address: MINT, abi: mintAbi, functionName: "maxPerWallet" },
      { address: MINT, abi: mintAbi, functionName: "saleActive" },
    ],
  });

  const totalSupply = (sale?.[0]?.result as bigint) ?? 0n;
  const maxSupply = (sale?.[1]?.result as bigint) ?? 0n;
  const price = (sale?.[2]?.result as bigint) ?? 0n;
  const maxPerWallet = (sale?.[3]?.result as bigint) ?? 0n;
  const saleActive = (sale?.[4]?.result as boolean) ?? false;

  const { data: wallet, refetch: refetchWallet } = useReadContracts({
    query: { enabled: enabled && !!address },
    contracts: [
      { address: SPCX, abi: erc20Abi, functionName: "balanceOf", args: [address!] },
      { address: SPCX, abi: erc20Abi, functionName: "allowance", args: [address!, MINT] },
      { address: MINT, abi: mintAbi, functionName: "mintedBy", args: [address!] },
    ],
  });

  const balance = (wallet?.[0]?.result as bigint) ?? 0n;
  const allowance = (wallet?.[1]?.result as bigint) ?? 0n;
  const minted = (wallet?.[2]?.result as bigint) ?? 0n;

  const { data: decimals } = useReadContract({
    address: SPCX, abi: erc20Abi, functionName: "decimals",
    query: { enabled },
  });

  const cost = useMemo(() => price * BigInt(quantity), [price, quantity]);
  const remaining = maxSupply > totalSupply ? maxSupply - totalSupply : 0n;
  const walletRemaining =
    maxPerWallet > minted ? Number(maxPerWallet - minted) : 0;
  const maxSelectable = Math.max(
    1,
    Math.min(walletRemaining || 1, Number(remaining > 20n ? 20n : remaining) || 1),
  );

  const soldOut = enabled && maxSupply > 0n && remaining === 0n;
  const wrongNetwork = !!address && chainId !== robinhoodChain.id;
  const insufficient = !!address && balance < cost;

  const refresh = useCallback(() => {
    refetchSale();
    refetchWallet();
  }, [refetchSale, refetchWallet]);

  const mint = useCallback(async () => {
    if (!address || !enabled) return;
    setError(null);
    setTxHash(null);

    try {
      const provider: any = await connector?.getProvider?.();
      const batched =
        provider && (await supportsAtomicBatch(provider, address, robinhoodChain.id));

      if (batched) {
        // One signature: approve + mint, atomic.
        setStatus("minting");
        const calls = [
          {
            to: SPCX,
            data: encodeFunctionData({
              abi: erc20Abi, functionName: "approve", args: [MINT, cost],
            }),
          },
          {
            to: MINT,
            data: encodeFunctionData({
              abi: mintAbi, functionName: "mint", args: [BigInt(quantity)],
            }),
          },
        ];
        await provider.request({
          method: "wallet_sendCalls",
          params: [
            {
              version: "1.0",
              chainId: `0x${robinhoodChain.id.toString(16)}`,
              from: address,
              calls,
            },
          ],
        });
        setStatus("success");
        refresh();
        return;
      }

      // Fallback: approve first if the allowance is short, then mint.
      if (allowance < cost) {
        setStatus("approving");
        const approveHash = await writeContractAsync({
          address: SPCX, abi: erc20Abi, functionName: "approve", args: [MINT, cost],
        });
        await waitForTransactionReceipt(config, { hash: approveHash });
      }

      setStatus("minting");
      const hash = await writeContractAsync({
        address: MINT, abi: mintAbi, functionName: "mint", args: [BigInt(quantity)],
      });
      setTxHash(hash);
      setStatus("confirming");
      await waitForTransactionReceipt(config, { hash });
      setStatus("success");
      refresh();
    } catch (e: any) {
      // Rejected signatures are not failures worth shouting about.
      const msg: string = e?.shortMessage ?? e?.message ?? "Transaction failed.";
      if (/user rejected|denied|4001/i.test(msg)) {
        setStatus("idle");
        return;
      }
      setError(msg);
      setStatus("error");
    }
  }, [
    address, allowance, config, connector, cost, enabled, quantity, refresh,
    writeContractAsync,
  ]);

  return {
    quantity, setQuantity, maxSelectable,
    status, error, txHash,
    totalSupply, maxSupply, price, cost, decimals: decimals ?? 18,
    balance, minted, maxPerWallet, walletRemaining,
    saleActive, soldOut, wrongNetwork, insufficient, enabled,
    mint, reset: () => { setStatus("idle"); setError(null); setTxHash(null); },
  };
}
