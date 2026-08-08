# Design Audit — Broker-nauts mint site

Run against the first build. Two passes: a **critique** of what was wrong, and a
**system** change fixing it at the token level rather than per-component.

---

## 1. Why the background "wasn't making content visible"

The complaint was correct and measurable. Contrast ratios on the original
palette (`bone #F4F4F4` at Tailwind opacity steps, over `void #080B10`):

| Class | Effective colour | Ratio | WCAG AA body (4.5:1) | Used for |
|---|---|---|---|---|
| `text-bone/25` | `#434549` | **2.05** | ❌ FAIL | footer disclaimer |
| `text-bone/30` | `#4F5154` | **2.47** | ❌ FAIL | disabled labels |
| `text-bone/40` | `#66686B` | **3.53** | ❌ FAIL | eyebrows, stats, ticker, meta |
| `text-bone/50` | `#7E8082` | 4.97 | ✅ pass | secondary body |
| `text-bone/60` | `#969799` | 6.74 | ✅ pass | nav, FAQ answers |

Three failures, and `bone/40` was the most-used class on the page — every
eyebrow label, the chain/supply/currency stats, and the ticker.

**The bigger problem was structure, not text:**

| Pair | Ratio | Needed | Result |
|---|---|---|---|
| `edge` border vs `void` | **1.26** | 3:1 (WCAG 1.4.11) | ❌ borders invisible |
| `panel` card vs `void` page | **1.05** | ~1.2 to perceive | ❌ no card elevation |

So every panel border, table divider, input outline and card edge was
effectively invisible, and the mint card didn't separate from the page at all.
The page read as floating grey text on flat black — which is exactly what was
reported.

## 2. Critique — beyond contrast

**First impression.** The eye landed on the wordmark, correct. But the mint card,
the single most important element, had no visual weight — no border, no
elevation, no shadow. The primary conversion target was the least prominent
thing on screen.

**Hierarchy.** Four text opacities (`/80 /70 /60 /50 /40 /25`) implied six levels
of importance where the content has three: primary, secondary, muted. Opacity
steps were doing decorative work, not encoding hierarchy.

**Usability.** There was no path for a user who holds ETH but no SPCX — the
mint's entire prerequisite. The site assumed you'd already solved that.

**Honesty.** The unconfigured state rendered a developer error ("Set
NEXT_PUBLIC_SPCX_ADDRESS…") to the public. Fine for you, wrong for a visitor.

**Texture.** `.scanlines` washed the full page in a repeating gradient, costing
legibility everywhere in exchange for a texture nobody would name.

## 3. System changes

### Colour tokens — solid values, not opacity

Opacity modifiers made contrast unauditable: `text-ink/40` has a different real
ratio on every surface it lands on. Replaced with named solid tokens, each
verified against its intended background.

| Token | Hex | Role | Verified |
|---|---|---|---|
| `void` | `#05080C` | page | — |
| `panel` | `#151D28` | cards | 1.18 lift over void |
| `raised` | `#232D3C` | inputs, tabs | 1.15 over panel |
| `hair` | `#27313F` | decorative dividers | 1.29 over panel |
| `edge` | `#6B7787` | **control boundaries** | **3.73:1 on panel** ✅ |
| `ink` | `#F2F5F7` | primary text | 15.5:1 on panel ✅ |
| `ash` | `#AEB8C4` | secondary text | 8.4:1 ✅ |
| `slate` | `#8A96A4` | muted text | 5.6:1 ✅ |
| `neon` | `#CCFF00` | accent | 14.4:1 ✅ |
| `term` | `#39FF6A` | live data | 12.7:1 ✅ |
| `halt` | `#FF5C5C` | errors | 5.6:1 ✅ |

**Borders split in two.** `hair` for decorative dividers (no WCAG requirement),
`edge` for anything bounding a control (3:1 required). Conflating them was why
inputs had invisible outlines.

**Surface elevation is 1.18, below the 1.3 I first targeted.** Pushing `panel`
lighter turned the void grey and muddy. There is no WCAG threshold for surface
elevation, and a modest lift paired with a 3.7:1 border is how Linear and Vercel
handle dark cards. Deliberate trade, not an oversight.

### Background

Flat `#080B10` plus full-page scanlines → a darker base with two soft radial
gradients (green top-left, neon top-right, both under 6% opacity) and the
starfield confined to the hero via `.starfield`. The page now has a light source
and depth, and no texture sits behind body copy.

### Components added

- **`Tabs.tsx`** — `Get SPCX` / `Mint`, with proper `role="tablist"`,
  `aria-selected`, and `aria-controls`.
- **`SwapPanel.tsx`** — live ETH and SPCX balances, amount entry with max,
  over-balance handling, routes out to a configured DEX.
- **`MintWidget`** — now opens in a public pre-launch state showing supply,
  price, per-wallet cap and chain, with a follow CTA. The developer
  configuration error is gone from the public surface.

## 4. Deliberate omission: in-page swap execution

The swap tab routes to a DEX rather than executing `exactInputSingle` in-page.
A self-hosted swap needs a router address, a quoter, and a fee tier that cannot
be verified against a live pool from here — and a wrong route silently loses
real money. The panel does the genuinely useful, safe part: shows what you hold,
what you need, and sends you somewhere with the token pre-filled.

Moving execution in-page later is additive: add router/quoter env vars and swap
the anchor for a button. The component's surface doesn't change.

## 5. Still open

- **Visual verification.** Ratios are computed, not eyeballed — there's no
  browser here. Run it locally and check the hero at 360px.
- **The USD peg.** Price is `$0.50` worth of SPCX. The UI does no conversion; the
  contract should quote from a Chainlink feed. Converting in the browser would
  let the displayed price drift from what the contract charges.
- **`maxPerWallet`** is 5 in the contract constants and read from chain at
  runtime. Keep those in sync or the UI will cap at the wrong number.
- **Verify the SPCX address** on Robinhood's official contracts page before
  launch. It's now defaulted in `contracts.ts`, which makes it easy to ship
  unverified.
