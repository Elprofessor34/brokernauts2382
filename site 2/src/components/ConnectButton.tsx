"use client";

import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { robinhoodChain } from "@/lib/chain";
import { short } from "@/lib/format";

export function ConnectButton() {
  const { address, chainId, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);

  const wrongNetwork = isConnected && chainId !== robinhoodChain.id;

  if (wrongNetwork) {
    return (
      <button
        onClick={() => switchChain({ chainId: robinhoodChain.id })}
        className="border border-halt px-4 py-2 text-xs uppercase tracking-widest text-halt transition hover:bg-halt hover:text-void"
      >
        Switch to Robinhood Chain
      </button>
    );
  }

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="group border border-hair px-4 py-2 text-xs uppercase tracking-widest text-ink transition hover:border-neon hover:text-neon"
        title="Disconnect"
      >
        <span className="mr-2 inline-block h-1.5 w-1.5 bg-term align-middle" />
        {short(address)}
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-expanded={open}
        className="border border-neon bg-neon px-4 py-2 text-xs uppercase tracking-widest text-void transition hover:bg-transparent hover:text-neon disabled:opacity-50"
      >
        {isPending ? "Connecting" : "Connect wallet"}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-56 border border-hair bg-panel">
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => {
                connect({ connector: c });
                setOpen(false);
              }}
              className="block w-full px-4 py-3 text-left text-xs uppercase tracking-wider text-ink transition hover:bg-raised hover:text-neon"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
