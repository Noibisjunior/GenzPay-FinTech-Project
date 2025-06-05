const animate = require("tailwindcss-animate")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#D0D5DD80",
        // input: "hsl(var(--input))",
        // ring: "hsl(var(--ring))",
        background: "#FAFBFF",
        shadow: "#1018280D",
        // foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#7105E9",
          light: "#9C42FF",
          dark: "#5506AD",
          foreground: "#fff",
        },
        secondary: {
          DEFAULT: "#222B45",
          foreground: "#F9F5FF80;",
        },
        blue: {
          DEFAULT: "#172590",
          foreground: "#1725900D",
          border: "#17259026"
        },
        green: {
          DEFAULT: "#347809",
          foreground: "#31551A0D",
          border: "#34780926"
        },
        yellow: {
          DEFAULT: "#A37E1D",
          foreground: "#A37E1D0D",
          border: "#A37E1D26"
        },
        red: {
          DEFAULT: "#B93815",
          foreground: "#FFF4ED",
          border: "#B93815"
        },
        // destructive: {
        //   DEFAULT: "hsl(var(--destructive))",
        //   foreground: "hsl(var(--destructive-foreground))",
        // },
        muted: {
          DEFAULT: "#222B45",
          foreground: "#475467",
          background: "#D0D5DD4D",
          border: "#9AA4B5B2",
        },
        // accent: {
        //   DEFAULT: "hsl(var(--accent))",
        //   foreground: "hsl(var(--accent-foreground))",
        // },
        // popover: {
        //   DEFAULT: "hsl(var(--popover))",
        //   foreground: "hsl(var(--popover-foreground))",
        // },
        // card: {
        //   DEFAULT: "hsl(var(--card))",
        //   foreground: "hsl(var(--card-foreground))",
        // },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
}