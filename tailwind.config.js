/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D82C6",
        secondary: {
          DEFAULT: "#FF9C01",
          100: "#FF9001",
          200: "#FF8E01",
        },
        black: {
          DEFAULT: "#000",
          100: "#1E1E2D",
          200: "#232533",
        },
        gray: {
          100: "#CDCDE0",
        },
        'd-purple': {
          DEFAULT: '#63519F'
        },
        'd-green': {
          DEFAULT: "#3AB83C",
          100: "#3AB83C",
          200: "#3AB83C",
        },
        'd-blue': {
          DEFAULT: "#1D82C6"
        },
        'd-orange': {
          DEFAULT: "#FF736A"
        },
        'b-secondary': {
          DEFAULT: '#EFEFEF'
        }
      },
    },
  },
  plugins: [],
}