import { createConfig, http, createStorage, cookieStorage } from "wagmi";
// Imported from @wagmi/core rather than "wagmi/connectors": that barrel pulls in
// Base Account -> Coinbase CDP SDK -> @x402/*, whose optional deps don't resolve
// and break the webpack build. Core exports `injected` directly.
import { injected } from "@wagmi/core";
import { robinhoodChain } from "./chain";

export const wagmiConfig = createConfig({
  chains: [robinhoodChain],
  // EIP-6963 discovery (on by default) surfaces every injected wallet the user
  // has installed - MetaMask, Rabby, Coinbase extension - as its own connector,
  // so an explicit per-wallet list isn't needed.
  connectors: [injected({ shimDisconnect: true })],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [robinhoodChain.id]: http(process.env.NEXT_PUBLIC_RPC_URL ?? ""),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}
