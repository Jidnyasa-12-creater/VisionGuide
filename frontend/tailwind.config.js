/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8", // High contrast blue
        secondary: "#9333ea",
        dark: "#111827",
        light: "#f3f4f6"
      }
    },
  },
  plugins: [],
}
