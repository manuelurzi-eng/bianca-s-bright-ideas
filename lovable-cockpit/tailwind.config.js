/** @type {import('tailwindcss').Config} */
// I token brand vivono in public/colors_and_type.css come CSS variables.
// Tailwind qui li rimappa così le utility (bg-plum, text-indigo, ecc.) restano
// coerenti col design. Il grosso del layout resta inline-style come nel prototipo.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        plum: { 900: "var(--plum-900)", 700: "var(--plum-700)" },
        indigo: { 700: "var(--indigo-700)", 600: "var(--indigo-600)", 800: "var(--indigo-800)" },
        lilac: {
          400: "var(--lilac-400)", 300: "var(--lilac-300)",
          200: "var(--lilac-200)", 100: "var(--lilac-100)",
        },
        cream: "var(--cream)",
        burgundy: "var(--burgundy-700)",
        green: { 400: "var(--green-400)" },
        ink: {
          700: "var(--ink-700)", 500: "var(--ink-500)",
          400: "var(--ink-400)", 300: "var(--ink-300)", 200: "var(--ink-200)",
        },
      },
      fontFamily: {
        display: ["Halyard Display", "Poppins", "system-ui", "sans-serif"],
        text: ["Halyard Text", "Halyard Display", "Poppins", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
