/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fb',
          100: '#e0e8f5',
          200: '#c2d1eb',
          300: '#96aed8',
          400: '#6485c1',
          500: '#4064ab',
          600: '#31508f',
          700: '#2a4174',
          800: '#263760',
          900: '#243051',
          950: '#0f1828',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}