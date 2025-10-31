/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{components,hooks,services}/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        "background-light": "#FFFFFF",
        "background-dark": "#000000",
      },
      fontFamily: {
        display: ["'Space Mono'", 'monospace'],
      },
      borderRadius: {
        DEFAULT: "0",
        'md': '0.375rem',
      },
      boxShadow: {
        'brutalist': '2px 2px 0px #000',
        'brutalist-dark': '2px 2px 0px #FFF',
      }
    },
  },
  plugins: [],
}