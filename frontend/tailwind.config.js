/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      screens: {
        landscape: { raw: "(orientation: landscape) and (min-width: 640px)" },
      },
      colors: {
        void: "#0B0F1F",
        panel: "#1A2138",
        "panel-raised": "#232C4D",
        "panel-line": "#2E386B",
        signal: "#3FE8D2",
        "signal-dim": "#1F7A70",
        alert: "#FF6B5B",
        caution: "#FFC24B",
        paper: "#F4F6FF",
        "paper-dim": "#A6ACC9",
      },
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["'Space Grotesk'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
      borderRadius: {
        chunky: "1.75rem",
      },
      boxShadow: {
        panel: "0 8px 0 0 rgba(0,0,0,0.35)",
        "panel-sm": "0 4px 0 0 rgba(0,0,0,0.35)",
      },
      keyframes: {
        "scanner-sweep": {
          "0%": { transform: "translateX(-120%) rotate(8deg)", opacity: "0" },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateX(220%) rotate(8deg)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(63,232,210,0.45)" },
          "50%": { boxShadow: "0 0 0 10px rgba(63,232,210,0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "scanner-sweep": "scanner-sweep 5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "page-enter": "page-enter 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
