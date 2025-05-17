module.exports = {
  important: true,
  safelist: ["bg-game-card-bg", "hover:bg-violet-400", "active:bg-violet-500"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "game-card-bg": "#b4b4b4",
        "game-card-header": "#523667",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
