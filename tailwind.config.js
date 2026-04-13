/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // primary purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        accent: {
          pink: '#ff4ecd',
          cyan: '#22d3ee',
          green: '#34d399',
          orange: '#fb923c',
        },

        background: {
          light: '#ffffff',
          dark: '#0f0f1a',
        },

        surface: {
          light: '#f9fafb',
          dark: '#1a1a2e',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
        glow: '0 0 25px rgba(139,92,246,0.4)',
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
