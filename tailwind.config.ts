import type { Config } from "tailwindcss";

/**
 * Tokens are solid hex values, not opacity modifiers on a single ink colour.
 * Opacity-based text (text-bone/40 etc.) made contrast unauditable and shipped
 * several WCAG failures; every value below is verified against its intended
 * surface. See DESIGN-AUDIT.md for the ratios.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // surfaces (dark -> light)
        void: "#05080C",     // page
        panel: "#151D28",    // cards
        raised: "#232D3C",   // inputs, tabs, wells

        // lines
        hair: "#27313F",     // decorative dividers
        edge: "#6B7787",     // control boundaries — 3.7:1 on panel

        // text
        ink: "#F2F5F7",      // primary       15.5:1 on panel
        ash: "#AEB8C4",      // secondary      8.4:1 on panel
        slate: "#8A96A4",    // muted          5.6:1 on panel

        // accents
        neon: "#CCFF00",
        term: "#39FF6A",
        gold: "#F5C542",
        halt: "#FF5C5C",
      },
      fontFamily: { mono: ["var(--font-mono)", "ui-monospace", "monospace"] },
      keyframes: {
        ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        rise: { "0%": { transform: "translateY(6px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        pulseline: { "0%,100%": { opacity: "0.35" }, "50%": { opacity: "1" } },
      },
      animation: {
        ticker: "ticker 45s linear infinite",
        rise: "rise .4s ease-out both",
        pulseline: "pulseline 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
