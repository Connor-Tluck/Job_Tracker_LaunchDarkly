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
          DEFAULT: "#0a0a0a",
          secondary: "#1a1a1a",
          tertiary: "#2a2a2a",
        },
        foreground: {
          DEFAULT: "#ffffff",
          secondary: "#a0a0a0",
          muted: "#6a6a6a",
        },
        border: {
          DEFAULT: "#2a2a2a",
          light: "#3a3a3a",
        },
        primary: {
          DEFAULT: "#6366f1",
          hover: "#818cf8",
        },
        accent: {
          DEFAULT: "#8b5cf6",
          hover: "#a78bfa",
        },
      },
    },
  },
  plugins: [],
};
export default config;

