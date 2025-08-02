import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'neu': '20px',
        'neu-sm': '12px',
        'neu-lg': '32px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Neumorphism color palette
        neu: {
          light: '#f0f0f3',
          base: '#e6e7ee',
          dark: '#a3a3a7',
          shadow: '#d1d9e6',
          highlight: '#ffffff',
          accent: '#667eea',
          'accent-light': '#764ba2',
          surface: '#efeff4',
        },
      },
      boxShadow: {
        // Neumorphism shadows
        'neu': '9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff',
        'neu-inset': 'inset 9px 9px 16px #d1d9e6, inset -9px -9px 16px #ffffff',
        'neu-sm': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'neu-lg': '15px 15px 30px #d1d9e6, -15px -15px 30px #ffffff',
        'neu-xl': '20px 20px 40px #d1d9e6, -20px -20px 40px #ffffff',
        'neu-pressed': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
        'neu-hover': '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
        'neu-focus': '0 0 20px rgba(102, 126, 234, 0.6), 9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "neu-float": {
          "0%, 100%": {
            transform: "translateY(0px)",
            boxShadow: "9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff",
          },
          "50%": {
            transform: "translateY(-5px)",
            boxShadow: "12px 12px 20px #d1d9e6, -12px -12px 20px #ffffff",
          },
        },
        "neu-pulse": {
          "0%, 100%": {
            boxShadow: "9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff",
          },
          "50%": {
            boxShadow: "6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "neu-float": "neu-float 3s ease-in-out infinite",
        "neu-pulse": "neu-pulse 2s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Custom plugin for neumorphism utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.neu-element': {
          background: 'linear-gradient(145deg, #f0f0f3, #caccd3)',
          boxShadow: '9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff',
          borderRadius: '20px',
        },
        '.neu-inset': {
          background: 'linear-gradient(145deg, #caccd3, #f0f0f3)',
          boxShadow: 'inset 9px 9px 16px #d1d9e6, inset -9px -9px 16px #ffffff',
          borderRadius: '20px',
        },
        '.neu-button': {
          background: 'linear-gradient(145deg, #f0f0f3, #caccd3)',
          boxShadow: '9px 9px 16px #d1d9e6, -9px -9px 16px #ffffff',
          borderRadius: '20px',
          transition: 'all 0.2s ease',
        },
        '.neu-button:hover': {
          boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
          transform: 'translateY(-1px)',
        },
        '.neu-button:active': {
          boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
          transform: 'translateY(0px)',
        },
        '.neu-card': {
          background: 'linear-gradient(145deg, #f0f0f3, #caccd3)',
          boxShadow: '15px 15px 30px #d1d9e6, -15px -15px 30px #ffffff',
          borderRadius: '32px',
        },
        '.neu-input': {
          background: 'linear-gradient(145deg, #caccd3, #f0f0f3)',
          boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
          borderRadius: '12px',
          border: 'none',
        },
        '.neu-input:focus': {
          boxShadow: 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff, 0 0 20px rgba(102, 126, 234, 0.6)',
          outline: 'none',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;
