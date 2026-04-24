import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0F172A",
        "bg-2": "#1E293B",
        "bg-3": "#162032",
        accent: "#2563EB",
        "accent-hover": "#1D4ED8",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        "text-1": "#F1F5F9",
        "text-2": "#94A3B8",
        "text-3": "#64748B",
        border: "rgba(148,163,184,0.1)",
        "border-2": "rgba(148,163,184,0.18)",
        background: "#0F172A",
        foreground: "#F1F5F9",
        card: { DEFAULT: "#1E293B", foreground: "#F1F5F9" },
        primary: { DEFAULT: "#2563EB", foreground: "#ffffff" },
        secondary: { DEFAULT: "#1E293B", foreground: "#F1F5F9" },
        muted: { DEFAULT: "#1E293B", foreground: "#64748B" },
        destructive: { DEFAULT: "#EF4444", foreground: "#fff" },
        ring: "#2563EB",
        input: "#1E293B",
        popover: { DEFAULT: "#1E293B", foreground: "#F1F5F9" },
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "cursive"],
        body: ["var(--font-instrument)", "sans-serif"],
        sans: ["var(--font-instrument)", "sans-serif"],
        mono: ["Courier New", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
