/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#08080a',
          900: '#12141a',
          850: '#181b24',
          800: '#222633',
          700: '#2d3345',
          600: '#3d445a',
        },
        orange: {
          950: '#2c0e04',
          900: '#431407',
          800: '#7c2d12',
          700: '#c2410c',
          600: '#ea580c',
          500: '#f97316',
          400: '#ff8548',
          300: '#ffa070',
        },
        gold: {
          900: '#78350f',
          800: '#92400e',
          700: '#b45309',
          600: '#d97706',
          500: '#f59e0b',
          400: '#fbbf24',
          300: '#fcd34d',
        },
        emerald: {
          950: '#022c22',
          900: '#064e3b',
          600: '#059669',
          500: '#10b981',
          400: '#34d399',
        }
      },
      fontFamily: {
        heading: ['Sora', 'Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glow-orange': '0 0 24px -4px rgba(249, 115, 22, 0.45)',
        'glow-gold': '0 0 24px -4px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}
