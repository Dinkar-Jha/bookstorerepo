/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — deep navy
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#1e1b4b',
          800: '#1a1740',
          900: '#14122e',
          DEFAULT: '#1e1b4b',
        },
        // Background — warm cream
        cream: {
          50:  '#fefcf8',
          100: '#fdf8f0',
          200: '#faf0e0',
          300: '#f5e6cc',
          DEFAULT: '#fdf8f0',
        },
        // Accent — burgundy
        accent: {
          50:  '#fff0f0',
          100: '#ffe0e0',
          200: '#ffc0c0',
          300: '#ff8080',
          400: '#e05252',
          500: '#7f1d1d',
          600: '#6b1a1a',
          700: '#571515',
          DEFAULT: '#7f1d1d',
        },
        // Amber / gold
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d97706',
          600: '#b45309',
          DEFAULT: '#d97706',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.625rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.875rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.625rem' }],
        '5xl':  ['3rem',     { lineHeight: '1.2' }],
        '6xl':  ['3.75rem',  { lineHeight: '1.1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        'card': '0.75rem',
        'btn':  '0.5rem',
      },
      boxShadow: {
        'card':     '0 2px 8px 0 rgba(30,27,75,0.08)',
        'card-hover': '0 8px 24px 0 rgba(30,27,75,0.16)',
        'nav':      '0 1px 4px 0 rgba(30,27,75,0.10)',
        'modal':    '0 20px 60px 0 rgba(30,27,75,0.20)',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [],
}
