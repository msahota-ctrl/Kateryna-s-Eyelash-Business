import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "rose-gold": "#b76e79",
        "rose-gold-light": "#d4a0a8",
        "rose-gold-dark": "#9a5a64",
        "rose-gold-bg": "#fdf6f7",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(183, 110, 121, 0.08)",
        "soft-md": "0 4px 30px rgba(183, 110, 121, 0.12)",
        "soft-lg": "0 8px 40px rgba(183, 110, 121, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;
