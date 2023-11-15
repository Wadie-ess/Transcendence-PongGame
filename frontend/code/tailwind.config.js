/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      animation: {
        border: 'background ease infinite',
      },
      keyframes: {
        background: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      screens: {
        '3xl': '1700px',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lexend: ['Lexend Peta', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']

      },

      backgroundImage: {
        'login': "url('./Components/Login/Assets/bg.gif')",
        'gif-error': "url('./Components/Error/Assets/Error.gif')",

      },

    },
  },

  plugins: [
    require("daisyui"),
    require('preline/plugin'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "base-100": "#000000",

          "base-200": "#272932",

          "primary": "#7940CF",

          "primary-content": "#5921CB",

          "secondary": "#6A4CFC",

          "secondary-content": "#1A1C26",

          "accent": "#1A1C26",

          "neutral": "#FFFFFF",

          "info": "#3e9cea",

          "success": "#1ba177",

          "warning": "#99670f",

          "error": "#e93f6f",
        },
        secondtheme: {


          "base-100": "#2b2d50",

          "base-200": "#1d252f",

          "primary": "#fcecb3",

          "primary-content": "#be8f04",

          "secondary": "#4c95c9",

          "secondary-content": "#79f289",

          "accent": "#66ebd9",

          "neutral": "#FFFFFF",

          "error": "#e93535",
        },

      },
      "light",
      "dark",
      "cyberpunk",
    ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {}
  },
}