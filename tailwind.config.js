/** @type {import('tailwindcss').Config} */
export default {
  content: {
    relative: true,
    files: ['./client/index.html', './client/src/**/*.{js,ts,jsx,tsx}'],
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
      boxShadow: {
        soft: '0 12px 35px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
