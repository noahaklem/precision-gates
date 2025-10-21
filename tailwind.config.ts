// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.5rem', sm: '2rem', lg: '3rem', xl: '3rem', '2xl': '3rem' },
      screens: { '2xl': '1280px' },
    },
  },
  plugins: [],
}

export default config


