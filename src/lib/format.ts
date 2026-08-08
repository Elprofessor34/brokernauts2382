export function short(a?: string) {
  return a ? `${a.slice(0, 6)}\u2026${a.slice(-4)}` : "";
}

/** Fixed-point formatting for bigint token amounts, no external library. */
export function fromUnits(v: bigint, decimals = 18, places = 4) {
  const neg = v < 0n;
  const abs = neg ? -v : v;
  const base = 10n ** BigInt(decimals);
  const whole = abs / base;
  const frac = (abs % base).toString().padStart(decimals, "0").slice(0, places);
  const trimmed = frac.replace(/0+$/, "");
  return `${neg ? "-" : ""}${whole}${trimmed ? "." + trimmed : ""}`;
}

export const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));
