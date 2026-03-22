/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF8',
          100: '#FDF6EC',
          200: '#FAE8CC',
          300: '#F5D6A8',
          400: '#E8C48A',
          500: '#DCC8A0',
        },
        sand: {
          100: '#F5EDE0',
          200: '#E8D9C5',
          300: '#D4C0A0',
          400: '#C4A97D',
          500: '#A68B5B',
        },
        warm: {
          50: '#FFF8F0',
          100: '#FFF1E3',
          200: '#FFE0C4',
          300: '#FFD0A5',
          400: '#F5B07A',
          500: '#E89B5A',
          600: '#8B6914',
          700: '#5C4520',
          800: '#3D2C1E',
          900: '#2A1D12',
        },
        pastel: {
          rose: '#F9D1D1',
          'rose-deep': '#E8A0A0',
          lavender: '#D5C6F0',
          'lavender-deep': '#B49EE0',
          mint: '#B8E6D0',
          'mint-deep': '#7CCBA4',
          peach: '#FFE0B2',
          'peach-deep': '#FFCC80',
          sky: '#B5D8F0',
          'sky-deep': '#8ABFDF',
        },
      },
    },
  },
  plugins: [],
};
