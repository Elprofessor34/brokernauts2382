"use client";

/** Ambient ticker running the trait vocabulary, doubled for a seamless loop. */
const ITEMS = [
  "BOWLER DOME", "MIRRORED VISOR", "BULL RUN PILOT", "OXYGEN HOSES",
  "PINSTRIPE PRESSURE SUIT", "FLIGHT COMPUTER", "GOLD GRILL", "ZERO-G CIGARETTE",
  "MISSION COMMANDER", "CRACKED VISOR", "BEAR MARKET SURVIVOR", "HALO RING",
  "TERMINAL AR READOUT", "LAUNCH PAD T-MINUS", "RED HALT", "GOLD VACUUM",
];

export function TickerTape() {
  const line = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-hair bg-panel/60 py-2">
      <div className="flex w-max animate-ticker gap-8 whitespace-nowrap">
        {line.map((t, i) => (
          <span
            key={i}
            className="text-[10px] uppercase tracking-[0.25em] text-term/60"
          >
            {t}
            <span className="ml-8 text-hair">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
