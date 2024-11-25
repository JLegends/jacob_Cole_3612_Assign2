/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,css,js}"],
  theme: {
    extend: {
      colors: {
        customRed: `#FF1E00`,
        customRedHover: `#CC1800`,
        customBlack: `#15151E`,
        customBlackHover: `#2A2A3A`,

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

