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
        background: {
          DEFAULT: "#0d1014",
          secondary: "#13171d",
          tertiary: "#1c2129",
          elevated: "#232933",
        },
        foreground: {
          DEFAULT: "#e5e7eb",
          secondary: "#9ca3af",
          muted: "#6b7280",
          subtle: "#4b5563",
        },
        border: {
          DEFAULT: "#1f242d",
          subtle: "#2a303b",
        },
        primary: {
          DEFAULT: "#10a37f",
          hover: "#1ab68f",
        },
        info: "#38bdf8",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
export default config;

