// tailwind.config.cjs
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 40%, 98%)',
        secondary: 'hsl(210, 15%, 20%)',
        accent: {
          primary: 'hsl(220, 90%, 56%)', // blue
          success: 'hsl(150, 70%, 40%)', // green
          purple: 'hsl(260, 70%, 60%)', // purple
        },
        background: 'hsl(0, 0%, 100%)',
        card: 'hsl(0, 0%, 98%)',
        border: 'hsl(210, 10%, 85%)',
      },
    },
  },
  plugins: [],
};
