import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://brokernauts.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Broker-nauts",
  description:
    "10,000 brokers working the void. A pixel art collection on Robinhood Chain.",
  openGraph: {
    title: "Broker-nauts",
    description: "10,000 brokers working the void.",
    images: ["/banner.png"],
  },
  twitter: { card: "summary_large_image", images: ["/banner.png"] },
};

export const viewport: Viewport = {
  themeColor: "#080B10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mono.variable}>
      <body className="bg-void text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
