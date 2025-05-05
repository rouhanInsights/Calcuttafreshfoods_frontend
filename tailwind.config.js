/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trendy: {
          500: "#81991f", // Your primary brand green
        },
        background: "oklch(1 0 0)",
        foreground: "oklch(0.145 0 0)",
        card: "oklch(1 0 0)",
        "card-foreground": "oklch(0.145 0 0)",
        border: "oklch(0.922 0 0)",   // ✅ Color entry
        ring: "oklch(0.708 0 0)",      // ✅ Ring color entry
      },
      borderColor: {
        border: "oklch(0.922 0 0)",   // ✅ Explicitly add under borderColor
      },
      textColor: {
        foreground: "oklch(0.145 0 0)", // ✅ Text color
      },
      backgroundColor: {
        background: "oklch(1 0 0)",     // ✅ Background color
      },
    },
  },
  plugins: [],
}
