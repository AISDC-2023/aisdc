const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.5rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '2rem' }],
      xl: ['1.25rem', { lineHeight: '2rem' }],
      '2xl': ['1.5rem', { lineHeight: '2.5rem' }],
      '3xl': ['2rem', { lineHeight: '2.5rem' }],
      '4xl': ['2.5rem', { lineHeight: '3rem' }],
      '5xl': ['3rem', { lineHeight: '3.5rem' }],
      '6xl': ['4rem', { lineHeight: '1' }],
      '7xl': ['5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    extend: {
      colors: {
        'blue': {
          50: '#f7fafc',
          100: '#edf2f7',
          200: '#d9e2ec',
          300: '#bac7d6',
          400: '#8a9cb3',
          500: '#5e84a0',
          600: '#487093', // base color
          700: '#355e77',
          800: '#2d485f',
          900: '#1e2a40',
        },
        orange: {
          50: '#fff7f3',
          100: '#fce8d9',
          200: '#f9c99f',
          300: '#f6aa65',
          400: '#f4812d',
          500: '#f2682b', // base color
          600: '#df5429',
          700: '#ba4223',
          800: '#912f1d',
          900: '#6d2317',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans]
      },
      maxWidth: {
        '2xl': '40rem',
      },
    },
  },
  plugins: [],
}
