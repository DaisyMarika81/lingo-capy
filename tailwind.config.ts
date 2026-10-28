import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Be Vietnam Pro'", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#FFFBF5",
          100: "#FFF5E6",
        },
        ink: {
          900: "#1E1B4B",
          700: "#312E81",
          500: "#4B4A6B",
          300: "#8E8DA8",
        },
        capy: {
          primary: "#4F46E5",
          primaryDark: "#3730A3",
          accent: "#FBBF24",
          accentDark: "#D99A06",
          brown: "#B7814F",
          tan: "#C99763",
          lightTan: "#E0B98A",
          darkBrown: "#5C3A1E",
          softBg: "#EEF2FF",
          border: "#E0E7FF",
          borderFocus: "#C7D2FE",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(49, 46, 129, 0.08)",
        "card-lg": "0 12px 32px rgba(49, 46, 129, 0.12)",
        "btn-primary": "0 4px 0 #3730A3",
        "btn-accent": "0 4px 0 #D99A06",
        "btn-light": "0 4px 0 #C7D2FE",
        "btn-pressed": "0 1px 0 #3730A3",
      },
      borderRadius: {
        "btn": "16px",
        "card": "24px",
        "card-lg": "32px",
      },
    },
  },
  plugins: [],
};
export default config;
