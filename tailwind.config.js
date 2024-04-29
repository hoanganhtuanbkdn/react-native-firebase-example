/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#3798B6',
        background2: '#1E6091',
        main: '#B5E48C',
        danger: '#FF6050',
        button: '#184E77',
        header: '#104271',
      },
    },
  },
  plugins: [],
};
