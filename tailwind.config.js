/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#2E7D32',
        accent: '#A5D6A7',
        surface: '#F9FFF9',
        ink: '#1B1B1B',
      },
      fontFamily: {
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 25px rgba(76, 175, 80, 0.15)',
      },
    },
  },
  plugins: [],
};
