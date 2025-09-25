// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./scr/app/**/*.{js,ts,jsx,tsx,mdx}','./src/components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#0A0A0A',
          dark:   '#151515',
          gray:   '#3A3A3A',
          mid:    '#6B6B6B',
          silver: '#BFBFBF',
          accent: '#5A7D9A' // or '#FFD54F' if you prefer yellow
        }
      },
      borderRadius: { '2xl': '1rem' },
      boxShadow: { soft: '0 10px 20px rgba(0,0,0,0.12)' }
    }
  },
  plugins: []
}
export default config
