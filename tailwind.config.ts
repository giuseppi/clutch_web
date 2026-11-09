import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import tailwindcssAnimate from "tailwindcss-animate";

/*
  How It Works pins one step at a time in a screen-tall panel under the navbar, so each step
  must fit the screen's height. These are measured needs (step height plus the panel's top
  padding, worst at the narrowest width), rounded up to the next 20 px:
    step-short: phones under 800 px tall (the step needs 784) and wider screens under 600 px
                hide the decorative numeral
    step-tight: phones under 660 px (640 without the numeral) and wider screens under 600 px
                (586) set the step tighter, with a smaller panel
    step-flat:  landscape screens under 420 px tall (a tight step needs 410 at 568-767 px
                wide, 370 at 844) put the copy beside the icon row, drop the tag and the
                "01 / 04" counter, and shrink the panel again; it fits down to 280 px tall
  Each tier sits inside the one before it, so step-flat also gets step-tight and step-short.
*/
const STEP_TIERS = {
  "step-short": "(max-width: 767px) and (max-height: 799px), (min-width: 768px) and (max-height: 599px)",
  "step-tight": "(max-width: 767px) and (max-height: 659px), (min-width: 768px) and (max-height: 599px)",
  "step-flat": "(orientation: landscape) and (max-height: 419px)",
};

/*
  The tiers are variants, not screens: a raw screen turns off the max-* and min-[...] variants
  site-wide. Plugin variants sort before md and lg, so each one doubles its class (&&) to
  outrank them, and step-tight:text-2xl still beats md:text-5xl.
*/
const stepTiers = plugin(({ addVariant }) => {
  for (const [name, query] of Object.entries(STEP_TIERS)) addVariant(name, `@media ${query} { && }`);
});

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
        display: ["Geist", "system-ui", "sans-serif"],
      },
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
        // Paper palette: cream paper, ink text, brand orange
        paper: "#F0EEE5",
        paperAlt: "#E9E5D8",
        ink: "#1A1A1A",
        inkMuted: "#7E7972",
        brand: "#FF6A00",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate, stepTiers],
} satisfies Config;
