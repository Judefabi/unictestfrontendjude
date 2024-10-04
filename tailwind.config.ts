import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      spaceGrotesk: ["Space Grotesk", "sans-serif"],
    },
    //used gemini code assist to autogenerate these fontsizes
    fontSize: {
      "display-large": "3.5625rem", // 57px
      "display-medium": "2.8125rem", // 45px
      "display-small": "2.25rem", // 36px
      "headline-large": "2rem", // 32px
      "headline-medium": "1.75rem", // 28px
      "headline-small": "1.5rem", // 24px
      "title-large": "1.375rem", // 22px
      "title-medium": "1rem", // 16px"
      "title-small": "0.875rem", // 14px
      "label-large": "0.875rem", // 14px
      "label-medium": "0.75rem", // 12px
      "label-small": "0.6875rem", // 11px"
      "body-large": "1rem", // 16px
      "body-medium": "0.875rem", // 14px
      "body-small": "0.75rem", // 12px
    },
    extend: {
      //used gemini code assist together with shadcn to generate these color scheme based on the figma design
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
