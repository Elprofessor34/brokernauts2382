"use client";

import { useMemo, useState } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { erc20Abi } from "@/lib/abi";
import { SPCX, SWAP_URL, isSpcxConfigured } from "@/lib/contracts";
import { robinhoodChain } from "@/lib/chain";
import { fromUnits } from "@/lib/format";
import { ConnectButton } from "./ConnectButton";

/**
 * Deliberately routes out to a DEX rather than executing the swap in-page.
 *
 * A self-hosted swap needs a router address, a quoter, and a fee tier that we
 * cannot verify against a live pool from here — and a wrong route silently
 * costs real money. This panel does the part that's genuinely useful and safe:
 * shows what you hold, what you need, and sends you to a venue with the token
 * pre-filled. Swap execution can move in-page later behind an env-configured
 * router without changing this component's surface.
 */
export function SwapPanel() {
  const { address, isConnected, chainId } = useAccount();
  const [amount, setAmount] = useState("");

  const { data: eth } = useBalance({
    address,
    query: { enabled: !!address },
  });

  const { data: spcxRaw } = useReadContract({
    address: SPCX,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && isSpcxConfigured, refetchInterval: 15_000 },
  });

  const spcx = (spcxRaw as bigint) ?? 0n;
  const wrongNetwork = isConnected && chainId !== robinhoodChain.id;

  const amountValid = useMemo(() => {
    if (!amount) return false;
    try {
      const v = parseEther(amount);
      return v > 0n && (!eth || v <= eth.value);
    } catch {
      return false;
    }
  }, [amount, eth]);

  const overBalance = useMemo(() => {
    if (!amount || !eth) return false;
    try {
      return parseEther(amount) > eth.value;
    } catch {
      return false;
    }
  }, [amount, eth]);

  const swapHref = SWAP_URL
    ? `${SWAP_URL}${SWAP_URL.includes("?") ? "&" : "?"}outputCurrency=${SPCX}${
        amountValid ? `&exactAmount=${amount}` : ""
      }`
    : "";

  return (
    <div className="p-6">
      <p className="text-sm leading-relaxed text-ash">
        Broker-nauts mint with SPCX, not ETH. Swap first, then mint when it
        opens.
      </p>

      {/* from */}
      <div className="mt-6 border border-edge bg-raised">
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="text-[10px] uppercase tracking-widest text-slate">
            You pay
          </span>
          {eth && (
            <button
              onClick={() => setAmount(fromUnits(eth.value, 18, 6))}
              className="text-[10px] uppercase tracking-widest text-slate transition hover:text-neon"
            >
              Max {fromUnits(eth.value, 18, 4)}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 px-4 pb-3">
          <input
            inputMode="decimal"
            placeholder="0.0"
            value={amount}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "" || /^\d*\.?\d*$/.test(v)) setAmount(v);
            }}
            aria-label="Amount of ETH to swap"
            className="w-full bg-transparent py-2 text-2xl tabular-nums text-ink outline-none placeholder:text-slate"
          />
          <span className="shrink-0 border border-hair px-2 py-1 text-xs text-ink">
            ETH
          </span>
        </div>
      </div>

      {/* direction */}
      <div className="relative my-1 flex justify-center">
        <span className="border border-edge bg-panel px-2 py-0.5 text-xs text-slate">
          ↓
        </span>
      </div>

      {/* to */}
      <div className="border border-hair bg-raised">
        <div className="px-4 pt-3">
          <span className="text-[10px] uppercase tracking-widest text-slate">
            You receive
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 px-4 pb-3">
          <span className="py-2 text-2xl tabular-nums text-slate">
            {amountValid ? "Quoted at the venue" : "—"}
          </span>
          <span className="shrink-0 border border-hair px-2 py-1 text-xs text-ink">
            SPCX
          </span>
        </div>
      </div>

      {isConnected && (
        <div className="mt-4 flex justify-between border-t border-hair pt-3 text-xs">
          <span className="uppercase tracking-widest text-slate">
            SPCX balance
          </span>
          <span className="tabular-nums text-term">
            {fromUnits(spcx, 18, 4)}
          </span>
        </div>
      )}

      {/* action */}
      <div className="mt-6">
        {!isConnected ? (
          <ConnectButton />
        ) : wrongNetwork ? (
          <ConnectButton />
        ) : overBalance ? (
          <>
            <button
              disabled
              className="w-full cursor-not-allowed border border-hair px-4 py-3 text-xs uppercase tracking-widest text-slate"
            >
              More than you hold
            </button>
            <p className="mt-3 text-xs leading-relaxed text-slate">
              You have {eth ? fromUnits(eth.value, 18, 6) : "0"} ETH. Bridge more
              to Robinhood Chain, or lower the amount.
            </p>
          </>
        ) : !SWAP_URL ? (
          <p className="border border-hair bg-raised p-3 text-xs leading-relaxed text-slate">
            No swap venue configured. Set{" "}
            <code className="text-neon">NEXT_PUBLIC_SWAP_URL</code> to a DEX that
            supports Robinhood Chain.
          </p>
        ) : (
          <a
            href={swapHref}
            target="_blank"
            rel="noreferrer"
            className="block w-full border border-neon bg-neon px-4 py-3 text-center text-xs uppercase tracking-widest text-void transition hover:bg-transparent hover:text-neon"
          >
            Swap on the DEX
          </a>
        )}

        <p className="mt-4 text-[10px] leading-relaxed text-slate">
          Swaps execute on a third-party DEX. Confirm the SPCX contract address
          matches the one in the footer before trading — impersonator tokens are
          common.
        </p>
      </div>
    </div>
  );
}
