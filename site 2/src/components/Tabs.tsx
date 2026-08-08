"use client";

import { useState } from "react";
import { SwapPanel } from "./SwapPanel";
import { MintWidget } from "./MintWidget";

type Tab = "swap" | "mint";

export function TradeTabs() {
  const [tab, setTab] = useState<Tab>("swap");

  const base =
    "relative flex-1 px-4 py-3 text-[11px] uppercase tracking-widest transition";

  return (
    <div className="border border-edge bg-panel">
      <div
        role="tablist"
        aria-label="Swap or mint"
        className="flex border-b border-hair bg-raised"
      >
        <button
          role="tab"
          id="tab-swap"
          aria-selected={tab === "swap"}
          aria-controls="panel-swap"
          onClick={() => setTab("swap")}
          className={`${base} ${
            tab === "swap"
              ? "bg-panel text-neon"
              : "text-slate hover:text-ash"
          }`}
        >
          Get SPCX
          {tab === "swap" && (
            <span className="absolute inset-x-0 bottom-[-1px] h-px bg-neon" />
          )}
        </button>

        <button
          role="tab"
          id="tab-mint"
          aria-selected={tab === "mint"}
          aria-controls="panel-mint"
          onClick={() => setTab("mint")}
          className={`${base} ${
            tab === "mint" ? "bg-panel text-neon" : "text-slate hover:text-ash"
          }`}
        >
          Mint
          <span className="ml-2 border border-hair px-1.5 py-0.5 text-[9px] tracking-normal text-slate">
            Soon
          </span>
          {tab === "mint" && (
            <span className="absolute inset-x-0 bottom-[-1px] h-px bg-neon" />
          )}
        </button>
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="animate-rise"
      >
        {tab === "swap" ? <SwapPanel /> : <MintWidget />}
      </div>
    </div>
  );
}
