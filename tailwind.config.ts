import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ball: {
          50: "#f2f6dc",
          100: "#e2eab8",
          200: "#cedb88",
          300: "#b6c85f",
          400: "#9fad46",
          500: "#84923a",
          600: "#687431",
          700: "#505a2b",
          800: "#404825",
          900: "#363d22"
        },
        sport: {
          50: "#edfdfa",
          100: "#d2f7ef",
          200: "#a8edde",
          300: "#71dcc8",
          400: "#37c1aa",
          500: "#13a18c",
          600: "#0f8b79",
          700: "#0f6f62",
          800: "#11584f",
          900: "#124943"
        },
        graphite: "#17202f"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 47, 0.08)",
        card: "0 14px 34px rgba(23, 32, 47, 0.1)",
        nav: "0 -12px 32px rgba(23, 32, 47, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
