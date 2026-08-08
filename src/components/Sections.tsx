import Image from "next/image";

const ART = [7, 16, 43, 2, 5, 11, 23, 34, 57, 88, 120, 201];

export function Gallery() {
  return (
    <section id="collection" className="border-t border-hair px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-term">
          The floor
        </p>
        <h2 className="mt-3 max-w-xl text-2xl leading-snug">
          Every trait drawn by hand in code. No generator, no AI art, no
          forty variations of the same hoodie.
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {ART.map((id) => (
            <div
              key={id}
              className="group relative aspect-square overflow-hidden border border-hair bg-void"
            >
              <Image
                src={`/art/${id}.png`}
                alt={`Broker-naut ${id}`}
                width={480}
                height={480}
                className="pixel h-full w-full"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <span className="absolute bottom-0 right-0 bg-void/80 px-2 py-1 text-[10px] tabular-nums text-ash">
                #{id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const TIERS = [
  { name: "Broker-naut", count: 7600, note: "Working the desk" },
  { name: "Flight Computer", count: 1500, note: "Doesn't sleep, doesn't panic" },
  { name: "Bear Market Survivor", count: 500, note: "Fur-lined, been through it" },
  { name: "Bull Run Pilot", count: 350, note: "Horns on the helmet" },
  { name: "Mission Commander", count: 50, note: "Gold dome, gold field" },
];

export function Tiers() {
  return (
    <section id="tiers" className="border-t border-hair px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-term">
          Tiers
        </p>
        <h2 className="mt-3 text-2xl">Five kinds of broker.</h2>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b border-hair text-left text-[10px] uppercase tracking-widest text-slate">
              <th className="py-3 font-normal">Tier</th>
              <th className="py-3 font-normal">Count</th>
              <th className="hidden py-3 font-normal sm:table-cell">Notes</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((t) => (
              <tr key={t.name} className="border-b border-hair">
                <td className="py-4">{t.name}</td>
                <td className="py-4 tabular-nums text-term">
                  {t.count.toLocaleString()}
                </td>
                <td className="hidden py-4 text-slate sm:table-cell">
                  {t.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const FAQ = [
  {
    q: "What do I mint with?",
    a: "SPCX, the tokenized SpaceX stock token on Robinhood Chain. Not ETH. You need a small amount of ETH on Robinhood Chain for gas.",
  },
  {
    q: "Why does my wallet only ask me to sign once?",
    a: "Wallets that support atomic batching combine the SPCX approval and the mint into a single transaction. If yours doesn't, you'll approve first and then mint, which is two signatures and works exactly the same.",
  },
  {
    q: "How many can I mint?",
    a: "There's a per-wallet cap enforced by the contract. The mint panel shows your remaining allocation once you connect.",
  },
  {
    q: "Where does it trade after mint-out?",
    a: "OpenSea, which supports Robinhood Chain. A link replaces the mint panel once the last one is gone.",
  },
  {
    q: "Is the art onchain?",
    a: "The images are pixel art rendered from a deterministic trait set and pinned to IPFS. The trait assignment and provenance hash are published so you can verify nothing was reshuffled after the fact.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-hair px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-term">
          Questions
        </p>
        <dl className="mt-10">
          {FAQ.map((item) => (
            <div key={item.q} className="border-b border-hair py-6">
              <dt className="text-sm text-ink">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-ash">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
