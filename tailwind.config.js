/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'luma-navy': '#0B0D1A',
        'luma-gold': '#D6B56D',
        'luma-purple': '#4A2D6B'
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif']
      }
    }
  },
  plugins: []
}
