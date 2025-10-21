/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'desi-brown': '#8B4513',
        'desi-gold': '#D4AF37',
        'desi-cream': '#F5E6D3',
        'desi-terracotta': '#E07A5F',
        'desi-green': '#3D5A40',
      },
      fontFamily: {
        'hindi': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}