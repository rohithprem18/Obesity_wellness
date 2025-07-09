/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: '#FF6D00', // Zepto/Swiggy orange
        accent: '#00B8D9',  // energetic blue
        success: '#43D675', // healthy green
        warning: '#FFD600', // yellow
        danger: '#FF1744',  // red
        info: '#2979FF',    // blue
        pink: '#EC4899',    // pink
        background: '#FFF8F1',
        card: '#FFFFFF',
        muted: '#F3F4F6',
      },
    },
  },
  plugins: [],
};
