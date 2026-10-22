export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        piragua: {
          900: '#0f172a',
          700: '#1d4ed8',
          500: '#3b82f6',
          100: '#dbeafe',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
