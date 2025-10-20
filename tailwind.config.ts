import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem', // ~px-6
        sm: '2rem',        // ~px-8
        lg: '3rem',        // ~px-12
        xl: '3rem',
        '2xl': '3rem'
      },
      screens: { '2xl': '1280px' } // match design width
    },
    extend: {
      colors: {
        brand: {
          black:  '#0A0A0A',
          dark:   '#151515',
          gray:   '#3A3A3A',
          mid:    '#6B6B6B',
          silver: '#BFBFBF',
          accent: '#5A7D9A' // swap for '#FFD54F' if you want a yellow accent
        }
      },
      borderRadius: {
        '2xl': '1rem'
      },
      boxShadow: {
        soft: '0 10px 20px rgba(0,0,0,0.12)'
      }
    }
  },
  plugins: []
}

export default config

