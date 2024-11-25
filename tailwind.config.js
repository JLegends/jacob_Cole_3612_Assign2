/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,css,js}"],
  theme: {
    extend: {
      colors: {
        customRed: `#FF1E00`,
        customRedHover: `#FE1E00`,
        customBlack: `#15151E`,
        customBlackHover: `#14141D`,

      },
      fontFamily: {
        doto:["doto", "sans-serif"],
        titillium:["Titillium Web", "sans-serif"]
      },
      skew: {
        '20':'20deg'
      }
    
    },
  },
  plugins: [],
}

