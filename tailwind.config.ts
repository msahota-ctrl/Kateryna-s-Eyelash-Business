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
        blush: {
          DEFAULT: "#F4A0B5",
          dark: "#E8839B",
          light: "#FDF0F4",
        },
        salon: {
          black: "#0A0A0A",
          white: "#FFFFFF",
        },
        // Legacy aliases kept so nothing breaks
        "rose-gold": "#F4A0B5",
        "rose-gold-light": "#FDF0F4",
        "rose-gold-dark": "#E8839B",
        "rose-gold-bg": "#FDF0F4",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 20px rgba(244,160,181,0.10)",
        "soft-md": "0 4px 30px rgba(244,160,181,0.14)",
        "soft-lg": "0 8px 40px rgba(244,160,181,0.18)",
        "elegant": "4px 4px 0px #F4A0B5",
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
