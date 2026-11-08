/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#080808',
          card: '#151515',
          cardHover: '#1c1c1c',
          yellow: '#FFD400',
          yellowHover: '#E6BE00',
          text: '#FFFFFF',
          muted: '#B8B8B8',
          subtle: '#6B7280',
          border: '#303030',
          borderHover: '#4B4B4B',
          darkYellow: '#B39500'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-yellow': '0 0 25px -5px rgba(255, 212, 0, 0.35)',
        'glow-yellow-sm': '0 0 12px -2px rgba(255, 212, 0, 0.3)',
        'glow-yellow-lg': '0 0 40px -5px rgba(255, 212, 0, 0.45)',
      }
    },
  },
  plugins: [],
}
