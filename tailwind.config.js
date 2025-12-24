
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#121212',
        'brand-surface': '#1e1e1e',
        'brand-primary': '#4285F4', // Google Blue
        'brand-secondary': '#34A853', // Google Green
        'brand-accent': '#EA4335', // Google Red
        'brand-text-primary': '#E8EAED',
        'brand-text-secondary': '#969BA1',
      },
    },
  },
  plugins: [],
}
