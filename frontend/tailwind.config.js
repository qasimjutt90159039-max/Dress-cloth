/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#fdf3f4',
          100: '#fbe6e8',
          200: '#f7cfd3',
          500: '#8a0b25',
          700: '#720d27',
          800: '#5c061d', // Primary brand deep maroon
          900: '#400313',
        },
        gold: {
          50: '#fbf8f0',
          100: '#f7eedd',
          300: '#e5cc8f',
          400: '#d9b662',
          500: '#c5a059', // Primary antique gold
          600: '#d4af37', // Bright gold accent
          700: '#9c7b2a',
        },
        ivory: {
          DEFAULT: '#FDFBF7',
          50: '#FFFFFF',
          100: '#FAF7F0',
          200: '#F4EFE6',
          300: '#ECE3D4',
        },
        emerald: {
          700: '#0e5a44',
          800: '#0b4636', // Luxury emerald accent
          900: '#062d22',
        },
        charcoal: {
          DEFAULT: '#222222',
          soft: '#333333',
          muted: '#666666',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Poppins', 'Inter', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #5C061D 0%, #3D0312 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C5A059 0%, #F5E5B8 50%, #C5A059 100%)',
      }
    },
  },
  plugins: [],
}
