/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        lexend: ['Lexend Peta', 'sans-serif'],
        montserrat : ['Montserrat', 'sans-serif']
        
      },
      backgroundImage: {
        'login': "url('./components/Login/Assets/bg.gif')",
        'gif-error': "url('./components/404/assest/Error.gif')",
        
      },

    },
  },
 
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
         mytheme: {
            "base-100":"#000000",

            "base-200":"#272932",
            
            "primary": "#7940CF",

            "primary-content" :"#5921CB",
                      
            "secondary": "#6A4CFC",
                      
            "accent": "#1A1C26",
                      
            "neutral": "#FFFFFF",
                                       
            "info": "#3e9cea",
                      
            "success": "#1ba177",
                      
            "warning": "#99670f",
                      
            "error": "#e93f6f",
          },
      },
      "light",
      "dark",
    ], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: "dark", // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
}