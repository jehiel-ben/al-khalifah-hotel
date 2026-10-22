/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🟠 ORANGE — couleur principale (boutons, accents)
        primary: {
          50:  '#FFF8ED',
          100: '#FFEFD3',
          200: '#FFDC9F',
          300: '#FFC266',
          400: '#F5A623', // ⭐ orange vif
          500: '#E8890C',
          600: '#D97706', // ⭐ orange profond
          700: '#B45309',
          800: '#8A3E07',
          900: '#5C2A05',
        },
        // 🌑 NOIR / GRIS FONCÉ — textes, footer, hero
        dark: {
          50:  '#F5F5F5',
          100: '#E5E5E5',
          200: '#C7C7C7',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#3D3D3D',
          700: '#2D2D2D', // ⭐ texte
          800: '#1F1F1F',
          900: '#1A1A1A', // ⭐ fond sombre
        },
        // ⚪ GRIS TRÈS CLAIR — fonds de sections
        soft: {
          50:  '#FCFCFC',
          100: '#FAFAFA',
          200: '#F7F7F7',
          300: '#EFEFEF',
        },
        // 🟡 JAUNE DORÉ — accents secondaires
        accent: {
          400: '#FFD966',
          500: '#F5C518',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':  '0 4px 20px rgba(0, 0, 0, 0.06)',
        'card':  '0 8px 30px rgba(0, 0, 0, 0.08)',
        'hover': '0 20px 40px rgba(245, 166, 35, 0.25)',
        'orange': '0 10px 30px rgba(232, 137, 12, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.7s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}