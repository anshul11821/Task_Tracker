import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0d0d14",
          card: "#13131f",
          border: "rgba(255,255,255,0.06)",
          surface: "#1a1a2e",
          hover: "#1e1e32",
        },
        brand: {
          purple: "#a78bfa",
          blue: "#38bdf8",
          orange: "#fb923c",
          pink: "#f472b6",
          green: "#34d399",
          red: "#f87171",
        },
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderColor: {
        DEFAULT: "rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
