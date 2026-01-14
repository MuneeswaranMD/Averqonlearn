/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4F47E6', // Indigo Blue
        background: '#F8FAFC',
        card: '#FFFFFF',
        text: {
          primary: '#0F172A',
          secondary: '#64748B'
        },
        accent: '#4F47E6',
        success: '#10B981',
        warning: '#F59E0B'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

