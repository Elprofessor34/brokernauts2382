import Image from "next/image";
import { Wordmark } from "@/components/Wordmark";
import { TickerTape } from "@/components/TickerTape";
import { TradeTabs } from "@/components/Tabs";
import { ConnectButton } from "@/components/ConnectButton";
import { Gallery, Tiers, Faq } from "@/components/Sections";
import { addressUrl } from "@/lib/chain";
import { MINT, SPCX, X_URL, isMintConfigured, isSpcxConfigured } from "@/lib/contracts";
import { short } from "@/lib/format";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* nav */}
      <header className="sticky top-0 z-30 border-b border-hair bg-void/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Wordmark className="h-3 w-auto text-neon" />
          <nav className="flex items-center gap-6">
            <a
              href="#collection"
              className="hidden text-[10px] uppercase tracking-widest text-ash transition hover:text-neon sm:block"
            >
              Collection
            </a>
            <a
              href="#faq"
              className="hidden text-[10px] uppercase tracking-widest text-ash transition hover:text-neon sm:block"
            >
              FAQ
            </a>
            <ConnectButton />
          </nav>
        </div>
      </header>

      <TickerTape />

      {/* hero */}
      <section className="starfield relative px-6 pb-16 pt-16 sm:pt-24">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <div>
            <Wordmark className="w-full max-w-lg text-neon" />
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ash">
              Ten thousand brokers working the void. The helmet is a bowler hat.
              That was the whole idea and we&apos;re not sorry.
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate">
              Minted with SPCX on Robinhood Chain. Pixel art, hand-drawn traits,
              deterministic provenance.
            </p>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-hair pt-6 text-[10px] uppercase tracking-widest text-slate">
              <span>
                Chain <span className="ml-2 text-term">Robinhood · 4663</span>
              </span>
              <span>
                Supply <span className="ml-2 text-term">10,000</span>
              </span>
              <span>
                Currency <span className="ml-2 text-term">SPCX</span>
              </span>
            </div>

            {/* hero art strip */}
            <div className="mt-10 flex gap-2">
              {[7, 16, 43, 5].map((id) => (
                <Image
                  key={id}
                  src={`/art/${id}.png`}
                  alt=""
                  width={200}
                  height={200}
                  priority={id === 7}
                  className="pixel w-1/4 border border-hair"
                />
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <TradeTabs />
          </div>
        </div>
      </section>

      <Gallery />
      <Tiers />
      <Faq />

      {/* footer */}
      <footer className="border-t border-hair px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark className="h-3 w-auto text-slate" />

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] uppercase tracking-widest text-slate">
            <a
              href={X_URL}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-neon"
            >
              X
            </a>
            {isMintConfigured && (
              <a
                href={addressUrl(MINT)}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-neon"
              >
                Contract {short(MINT)}
              </a>
            )}
            {isSpcxConfigured && (
              <a
                href={addressUrl(SPCX)}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-neon"
              >
                SPCX {short(SPCX)}
              </a>
            )}
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-5xl text-[10px] leading-relaxed text-slate">
          Broker-nauts is a digital art collection. Nothing here is an offer of
          investment, and no return is promised or implied. Verify every contract
          address on Blockscout before transacting.
        </p>
      </footer>
    </main>
  );
}
