"use client";

/**
 * Signature element: remaining supply drawn as a candlestick tape rather than a
 * progress bar. Each candle is 1/60th of the collection. Filled candles are
 * minted, hollow candles are still open. It reads as a chart because the
 * subject is brokers, and it encodes real data rather than decorating.
 */
export function SupplyLedger({
  minted,
  total,
}: {
  minted: number;
  total: number;
}) {
  const CANDLES = 60;
  const perCandle = total / CANDLES;
  const filledCount = total > 0 ? (minted / total) * CANDLES : 0;

  // Deterministic heights so the tape doesn't reshuffle on every render.
  const heights = Array.from({ length: CANDLES }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453;
    return 0.45 + (seed - Math.floor(seed)) * 0.55;
  });

  return (
    <div>
      <div
        className="flex h-24 items-end gap-[3px]"
        role="img"
        aria-label={`${minted} of ${total} minted`}
      >
        {heights.map((h, i) => {
          const filled = i < Math.floor(filledCount);
          const partial = i === Math.floor(filledCount);
          return (
            <div key={i} className="relative flex-1">
              <div
                className="w-full transition-[height] duration-500"
                style={{
                  height: `${h * 96}px`,
                  background: filled
                    ? "#39FF6A"
                    : partial
                      ? "#CCFF00"
                      : "transparent",
                  border: filled ? "none" : "1px solid #1B2430",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex justify-between border-t border-hair pt-2 text-[10px] uppercase tracking-widest text-slate">
        <span>
          {minted.toLocaleString()} minted
        </span>
        <span>{Math.round(perCandle)} per candle</span>
        <span>{(total - minted).toLocaleString()} open</span>
      </div>
    </div>
  );
}
