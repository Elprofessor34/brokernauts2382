import { defineChain } from "viem";

const RPC = process.env.NEXT_PUBLIC_RPC_URL ?? "";
const EXPLORER = process.env.NEXT_PUBLIC_EXPLORER_URL ?? "";

/**
 * Robinhood Chain — Arbitrum Orbit L2, chain ID 4663, ETH gas.
 * RPC and explorer come from env. Verify both against Robinhood's official
 * docs before deploying; do not hardcode a guessed endpoint.
 */
export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC] } },
  blockExplorers: { default: { name: "Blockscout", url: EXPLORER } },
});

export const txUrl = (hash: string) => `${EXPLORER}/tx/${hash}`;
export const addressUrl = (a: string) => `${EXPLORER}/address/${a}`;
