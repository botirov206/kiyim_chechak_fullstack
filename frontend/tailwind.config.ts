import type { Config } from 'tailwindcss'

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: {
            DEFAULT: '#10b981',
            700: '#047857',
            800: '#065f46',
          },
          ink: '#0b1220',
          gold: {
            DEFAULT: '#d4af37',
            700: '#b8860b',
          },
        },
      },
      boxShadow: {
        soft: '0 20px 50px -20px rgba(0, 0, 0, 0.55)',
      },
      fontFamily: {
        heading: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

export default config

