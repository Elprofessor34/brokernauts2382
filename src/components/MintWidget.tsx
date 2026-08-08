"use client";

import { useAccount } from "wagmi";
import { useMint } from "@/lib/useMint";
import { fromUnits } from "@/lib/format";
import { txUrl } from "@/lib/chain";
import {
  OPENSEA_URL, COLLECTION_SIZE, MAX_PER_WALLET, PRICE_USD, MINT_LIVE,
} from "@/lib/contracts";
import { ConnectButton } from "./ConnectButton";
import { SupplyLedger } from "./SupplyLedger";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-hair py-2 text-xs">
      <span className="uppercase tracking-widest text-slate">{label}</span>
      <span className="tabular-nums text-ink">{value}</span>
    </div>
  );
}

export function MintWidget() {
  const { isConnected } = useAccount();
  const m = useMint();

  const minted = Number(m.totalSupply);
  const total = Number(m.maxSupply) || COLLECTION_SIZE;

  // Public pre-launch state. The mint contract isn't deployed yet, so there is
  // nothing to point a button at — say so plainly instead of rendering a
  // disabled control or a developer error.
  if (!MINT_LIVE) {
    return (
      <div className="p-6">
        <div className="flex items-baseline justify-between border-b border-hair pb-3">
          <span className="text-[10px] uppercase tracking-widest text-slate">
            Status
          </span>
          <span className="text-[10px] uppercase tracking-widest text-neon">
            Not open yet
          </span>
        </div>

        <dl className="mt-4">
          <div className="flex justify-between border-b border-hair py-2 text-xs">
            <dt className="uppercase tracking-widest text-slate">Supply</dt>
            <dd className="tabular-nums text-ink">
              {COLLECTION_SIZE.toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between border-b border-hair py-2 text-xs">
            <dt className="uppercase tracking-widest text-slate">Price</dt>
            <dd className="tabular-nums text-ink">{PRICE_USD} in SPCX</dd>
          </div>
          <div className="flex justify-between border-b border-hair py-2 text-xs">
            <dt className="uppercase tracking-widest text-slate">Per wallet</dt>
            <dd className="tabular-nums text-ink">{MAX_PER_WALLET}</dd>
          </div>
          <div className="flex justify-between border-b border-hair py-2 text-xs">
            <dt className="uppercase tracking-widest text-slate">Chain</dt>
            <dd className="tabular-nums text-ink">Robinhood · 4663</dd>
          </div>
        </dl>

        <p className="mt-5 text-sm leading-relaxed text-ash">
          Get your SPCX ready in the other tab. Mint date goes out on X first.
        </p>

        <a
          href="https://x.com/brokernauts"
          target="_blank"
          rel="noreferrer"
          className="mt-5 block border border-neon bg-neon px-4 py-3 text-center text-xs uppercase tracking-widest text-void transition hover:bg-transparent hover:text-neon"
        >
          Follow for the drop
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="border-b border-hair px-6 py-5">
        <SupplyLedger minted={minted} total={total} />
      </div>

      <div className="px-6 py-5">
        <Row
          label="Supply"
          value={`${minted.toLocaleString()} / ${total.toLocaleString()}`}
        />
        <Row
          label="Price"
          value={`${fromUnits(m.price, m.decimals)} SPCX each`}
        />
        {isConnected && (
          <>
            <Row
              label="Your balance"
              value={`${fromUnits(m.balance, m.decimals)} SPCX`}
            />
            <Row
              label="You've minted"
              value={`${m.minted.toString()} / ${m.maxPerWallet.toString()}`}
            />
          </>
        )}

        {/* ---- states ---- */}
        {m.soldOut ? (
          <div className="mt-6">
            <p className="text-sm text-ash">
              All {total.toLocaleString()} are gone.
            </p>
            {OPENSEA_URL && (
              <a
                href={OPENSEA_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-4 block border border-neon bg-neon px-4 py-3 text-center text-xs uppercase tracking-widest text-void transition hover:bg-transparent hover:text-neon"
              >
                Trade on OpenSea
              </a>
            )}
          </div>
        ) : !isConnected ? (
          <div className="mt-6">
            <p className="mb-4 text-sm text-ash">
              Connect a wallet holding SPCX to mint.
            </p>
            <ConnectButton />
          </div>
        ) : m.wrongNetwork ? (
          <div className="mt-6">
            <p className="mb-4 text-sm text-halt">
              Your wallet is on the wrong network.
            </p>
            <ConnectButton />
          </div>
        ) : m.status === "success" ? (
          <div className="mt-6 animate-rise">
            <p className="text-sm text-term">
              Minted {m.quantity}. Welcome to the void.
            </p>
            {m.txHash && (
              <a
                href={txUrl(m.txHash)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block text-xs uppercase tracking-widest text-slate underline underline-offset-4 hover:text-neon"
              >
                View transaction
              </a>
            )}
            <button
              onClick={m.reset}
              className="mt-4 w-full border border-hair px-4 py-3 text-xs uppercase tracking-widest transition hover:border-neon hover:text-neon"
            >
              Mint more
            </button>
          </div>
        ) : (
          <div className="mt-6">
            {/* quantity */}
            <div className="mb-4 flex items-stretch border border-hair">
              <button
                onClick={() => m.setQuantity(Math.max(1, m.quantity - 1))}
                disabled={m.quantity <= 1}
                aria-label="Decrease quantity"
                className="w-12 text-lg text-ink transition hover:bg-raised hover:text-neon disabled:opacity-30"
              >
                −
              </button>
              <div className="flex flex-1 items-center justify-center border-x border-hair py-3 tabular-nums">
                {m.quantity}
              </div>
              <button
                onClick={() =>
                  m.setQuantity(Math.min(m.maxSelectable, m.quantity + 1))
                }
                disabled={m.quantity >= m.maxSelectable}
                aria-label="Increase quantity"
                className="w-12 text-lg text-ink transition hover:bg-raised hover:text-neon disabled:opacity-30"
              >
                +
              </button>
            </div>

            <Row
              label="Total"
              value={`${fromUnits(m.cost, m.decimals)} SPCX`}
            />

            <button
              onClick={m.mint}
              disabled={
                m.status === "approving" ||
                m.status === "minting" ||
                m.status === "confirming" ||
                m.insufficient ||
                !m.saleActive
              }
              className="mt-4 w-full border border-neon bg-neon px-4 py-3 text-xs uppercase tracking-widest text-void transition hover:bg-transparent hover:text-neon disabled:cursor-not-allowed disabled:border-hair disabled:bg-transparent disabled:text-slate"
            >
              {!m.saleActive
                ? "Mint not open"
                : m.insufficient
                  ? "Not enough SPCX"
                  : m.status === "approving"
                    ? "Approving SPCX…"
                    : m.status === "minting"
                      ? "Confirm in wallet…"
                      : m.status === "confirming"
                        ? "Confirming onchain…"
                        : "Mint"}
            </button>

            {m.insufficient && (
              <p className="mt-3 text-xs leading-relaxed text-ash">
                You need {fromUnits(m.cost, m.decimals)} SPCX and hold{" "}
                {fromUnits(m.balance, m.decimals)}. Top up, or lower the
                quantity.
              </p>
            )}

            {m.status === "error" && m.error && (
              <p className="mt-3 border border-halt/40 bg-halt/10 p-3 text-xs leading-relaxed text-halt">
                {m.error}
              </p>
            )}

            <p className="mt-4 text-[10px] leading-relaxed text-slate">
              Wallets supporting atomic batching sign once. Everything else
              approves, then mints.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
