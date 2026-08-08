# Broker-nauts — mint site

Next.js 14 (App Router) · TypeScript · Tailwind · wagmi v2 · viem.
Built for Robinhood Chain (Arbitrum Orbit L2, chain ID **4663**), minting with **SPCX**.

## Run locally

```bash
npm install
cp .env.example .env.local     # fill in the values
npm run dev
```

## Environment

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_RPC_URL` | yes | Robinhood Chain RPC. Verify against official docs. |
| `NEXT_PUBLIC_EXPLORER_URL` | yes | Blockscout base URL, no trailing slash. |
| `NEXT_PUBLIC_SPCX_ADDRESS` | yes | The SPCX ERC-20 you accept as payment. |
| `NEXT_PUBLIC_MINT_ADDRESS` | yes | Your deployed NFT contract. |
| `NEXT_PUBLIC_SITE_URL` | yes | Used for OG/Twitter image resolution. |
| `NEXT_PUBLIC_OPENSEA_URL` | no | Shown once the collection sells out. |
| `NEXT_PUBLIC_X_URL` | no | Footer link. |

**The mint button stays disabled until both contract addresses are valid.**
That's deliberate — an unconfigured build renders a configuration notice instead
of a button that would burn gas against the zero address.

## Deploy

1. Push to GitHub.
2. Import the repo in Vercel. Framework preset is detected automatically.
3. Add every variable above under Settings → Environment Variables.
4. Deploy.

Google Fonts is fetched at build time, so the build needs network access —
normal on Vercel, but it will fail in a sandboxed CI with no egress.

## Swapping in the deployed contract

Everything contract-related lives in three files:

- `src/lib/contracts.ts` — addresses, read from env
- `src/lib/abi.ts` — the interfaces the UI calls
- `src/lib/useMint.ts` — all read/write logic

`mintAbi` describes the contract you are *going to* deploy. Keep your Solidity
signatures identical to it, or update `abi.ts` to match what you shipped. The
functions expected are:

```solidity
function totalSupply()   external view returns (uint256);
function maxSupply()     external view returns (uint256);
function pricePerToken() external view returns (uint256); // in SPCX base units
function maxPerWallet()  external view returns (uint256);
function mintedBy(address) external view returns (uint256);
function saleActive()    external view returns (bool);
function mint(uint256 quantity) external;                 // pulls SPCX via transferFrom
```

## How the mint transaction works

The mint is `approve(SPCX)` then `mint()`. Rather than assuming wallet
capability, `useMint.ts` feature-detects EIP-5792 via `wallet_getCapabilities`:

- **Wallet supports atomic batching** → both calls go out in one
  `wallet_sendCalls` request. One signature. Modern wallets implement this on
  top of EIP-7702 delegation, which Robinhood Chain supports.
- **Wallet doesn't** → conventional approve-then-mint, two signatures.

Detection uses the raw EIP-1193 provider rather than an experimental library
surface, so it won't break when wagmi reshuffles its `experimental` exports.

Gas sponsorship via a paymaster is **not** wired up. Users need a small amount
of ETH on Robinhood Chain. If you add a paymaster later, it slots into the
batched branch of `useMint.ts` without touching the UI.

## Art

`public/art/` holds twelve sample pieces for the hero and gallery. Swap in your
own IDs and update the `ART` array in `src/components/Sections.tsx`. Every image
uses the `.pixel` class (`image-rendering: pixelated`) — remove it and the pixel
art will render blurred.

`public/wordmark.svg` is generated from the same 5×7 bitmap font as the X banner,
so site and social type match exactly.

## Assumptions worth verifying

- The mint contract pulls SPCX with `transferFrom`, so it needs an allowance.
  If yours takes native ETH or uses permit, `useMint.ts` needs changing.
- `pricePerToken()` returns SPCX base units. The UI does no USD conversion — if
  you want a live $0.50 peg, read a Chainlink feed on-chain and have the contract
  quote the price, rather than converting in the browser.
- Per-wallet cap is read from the contract, not hardcoded.
