import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // HaloShot brand colors
        violet: {
          DEFAULT: "#6C3CE0",
          50: "#F3EFFE",
          100: "#E4DBFD",
          200: "#C9B7FB",
          300: "#AE93F9",
          400: "#936FF7",
          500: "#6C3CE0",
          600: "#5A2FC4",
          700: "#4823A8",
          800: "#36178C",
          900: "#240B70",
        },
        lime: {
          DEFAULT: "#C5F536",
          50: "#F8FDE6",
          100: "#F1FBCD",
          200: "#E3F79B",
          300: "#D5F369",
          400: "#C5F536",
          500: "#A8D41A",
          600: "#86AA14",
          700: "#64800F",
          800: "#42550A",
          900: "#212B05",
        },
        halo: {
          DEFAULT: "#F5A623",
          50: "#FEF7E8",
          100: "#FDEFD1",
          200: "#FBDFA3",
          300: "#F9CF75",
          400: "#F7BF47",
          500: "#F5A623",
          600: "#D4891A",
          700: "#A36B14",
          800: "#724C0E",
          900: "#412C08",
        },
        surface: {
          DEFAULT: "#1A1A24",
        },
      },
      fontFamily: {
        display: ["var(--font-cabinet)", "system-ui", "sans-serif"],
        sans: ["var(--font-general)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "fade-in": "fade-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
