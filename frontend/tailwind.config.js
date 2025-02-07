/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Colors
      colors: {
        primary: "#FF5733", // Custom primary color
        secondary: "#1C1C1C", // Custom secondary color
        accent: "#FFC300", // Accent color
        background: "#F0F0F0", // Light background color
        foreground: "#2C3E50", // Dark foreground color
        success: "#28a745", // Success color (green)
        error: "#dc3545", // Error color (red)
        info: "#17a2b8", // Info color (blue)
        warning: "#ffc107", // Warning color (yellow)
        muted: "#6c757d", // Muted color (gray)
      },

      // Spacing
      spacing: {
        128: "32rem", // Custom large spacing
        144: "36rem", // Custom large spacing
        160: "40rem", // Custom large spacing
        72: "18rem", // Medium spacing
        80: "20rem", // Medium spacing
      },

      // Typography (Font Sizes)
      fontSize: {
        xs: "0.75rem", // Extra small
        sm: "0.875rem", // Small
        base: "1rem", // Base font size
        lg: "1.125rem", // Large
        xl: "1.25rem", // Extra large
        "2xl": "1.5rem", // 2x large
        "3xl": "1.875rem", // 3x large
        "4xl": "2.25rem", // 4x large
        "5xl": "3rem", // 5x large
        "6xl": "4rem", // 6x large
      },

      // Font Family
      fontFamily: {
        sans: ['"Open Sans"', 'Arial', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
        mono: ['"Fira Code"', 'Courier New', 'monospace'],
      },

      // Breakpoints (for responsive design)
      screens: {
        xs: "475px", // Extra small screens
        sm: "640px", // Small screens
        md: "768px", // Medium screens
        lg: "1024px", // Large screens
        xl: "1280px", // Extra large screens
        "2xl": "1536px", // 2x Extra large screens
      },

      // Box Shadow
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
      },

      // Z-Index
      zIndex: {
        "-1": "-1", // Behind elements
        0: "0", // Default
        10: "10", // Low level elements
        20: "20", // Medium level elements
        30: "30", // High level elements
        40: "40", // Floating elements
      },

      // Border Radius
      borderRadius: {
        sm: "0.125rem", // Small
        DEFAULT: "0.25rem", // Default
        lg: "0.375rem", // Large
        full: "9999px", // Full circle (for pills)
      },

      // Transition
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)", // Standard transition ease
        easeIn: "cubic-bezier(0.4, 0, 1, 1)", // Ease-in timing function
        easeOut: "cubic-bezier(0, 0, 0.2, 1)", // Ease-out timing function
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)", // Ease-in-out timing function
      },

      // Animation (using TailwindCSS Animate plugin)
      animation: {
        "spin-slow": "spin 3s linear infinite", // Slow spin animation
        fadeIn: "fadeIn 1s ease-in", // Fade in animation
        fadeOut: "fadeOut 1s ease-out", // Fade out animation
        bounce: "bounce 1s infinite", // Bounce animation
      },

      // Keyframes for custom animations
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        bounce: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Add animation utilities
    require("@tailwindcss/forms"), // Tailwind forms plugin (for better styling of form elements)
    require("@tailwindcss/typography"), // Tailwind typography plugin (for better text styling)
  ],
};
