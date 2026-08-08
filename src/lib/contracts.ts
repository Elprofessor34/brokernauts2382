import type { Address } from "viem";

export const ZERO = "0x0000000000000000000000000000000000000000" as Address;

function addr(value: string | undefined, fallback: Address = ZERO): Address {
  return value && /^0x[a-fA-F0-9]{40}$/.test(value) ? (value as Address) : fallback;
}

/**
 * SPCX — the Robinhood Chain SpaceX stock token used as mint currency.
 * Defaulted so the swap panel works out of the box, but still overridable.
 * VERIFY this against Robinhood's official contracts page before launch:
 * impersonator tokens with matching names are a known pattern.
 */
export const SPCX = addr(
  process.env.NEXT_PUBLIC_SPCX_ADDRESS,
  "0x4a0E65A3EcceC6dBe60AE065F2e7bb85Fae35eEa" as Address,
);

/** The NFT contract. Not deployed yet — mint stays closed until this is set. */
export const MINT = addr(process.env.NEXT_PUBLIC_MINT_ADDRESS);

export const isSpcxConfigured = SPCX !== ZERO;
export const isMintConfigured = MINT !== ZERO;

/** Mint opens only when the contract exists AND the flag is explicitly on. */
export const MINT_LIVE =
  isMintConfigured && process.env.NEXT_PUBLIC_MINT_LIVE === "true";

export const COLLECTION_SIZE = 10000;
export const MAX_PER_WALLET = 5;
export const PRICE_USD = "$0.50";

export const SWAP_URL = process.env.NEXT_PUBLIC_SWAP_URL ?? "";
export const OPENSEA_URL = process.env.NEXT_PUBLIC_OPENSEA_URL ?? "";
export const X_URL = process.env.NEXT_PUBLIC_X_URL ?? "https://x.com/brokernauts";
