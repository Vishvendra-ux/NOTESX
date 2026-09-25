/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support manual toggling or via system
  theme: {
    extend: {
      colors: {
        // Backgrounds
        bg: {
          light: '#F8FAFC',
          lightAlt: '#F1F5F9',
          dark: '#0B1020',
          darkAlt: '#111827',
        },
        // Primary - Deep Indigo / Electric Blue
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Electric Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af', // Deep Indigo
          900: '#1e3a8a',
          950: '#172554',
        },
        // Accents
        purple: {
          light: '#c084fc',
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
        },
        cyan: {
          light: '#22d3ee',
          DEFAULT: '#06b6d4',
          dark: '#0e7490',
        },
        emerald: {
          light: '#34d399',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
        orange: {
          light: '#fb923c',
          DEFAULT: '#f97316',
          dark: '#c2410c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
