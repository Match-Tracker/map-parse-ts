/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        "block": "#000000",
      }
    },
  },
  daisyui: {
    themes: [
      {
        default: {
          "primary": "#fc4949",
          "secondary": "#D926A9",
          "accent": "#1FB2A6",
          "neutral": "#1F202B",
          "base-100": "#151822",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  plugins: [],
  important: true,
  plugins: [require("daisyui")]
}
