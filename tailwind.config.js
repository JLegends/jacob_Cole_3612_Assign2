/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,css,js}"],
  theme: {
    extend: {
      fontFamily: {
        doto:["doto", "sans-serif"]
      },
      skew: {
        '20':'20deg'
      }
    
    },
  },
  plugins: [],
}

