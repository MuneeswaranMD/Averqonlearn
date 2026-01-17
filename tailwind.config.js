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
        primary: 'rgb(var(--primary))',
        background: 'rgb(var(--background))',
        card: 'rgb(var(--card))',
        'text-primary': 'rgb(var(--text-primary))',
        'text-secondary': 'rgb(var(--text-secondary))',
        border: 'rgb(var(--border))',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'dashboard': '0px 20px 50px rgba(0, 0, 0, 0.05)',
        'card': '0px 10px 30px rgba(0, 0, 0, 0.04)',
        'premium-card': '0 10px 40px -10px rgba(0, 0, 0, 0.05), 0 0 20px -5px rgba(var(--primary), 0.05)',
        'premium-card-hover': '0 20px 60px -12px rgba(0, 0, 0, 0.1), 0 0 30px -5px rgba(var(--primary), 0.15)',
        'premium-btn': '0 10px 25px -5px rgba(var(--primary), 0.4)',
        'premium-btn-hover': '0 15px 30px -5px rgba(var(--primary), 0.5)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(to bottom right, var(--primary-start), var(--primary-end))',
      }
    },
  },
  plugins: [],
}
