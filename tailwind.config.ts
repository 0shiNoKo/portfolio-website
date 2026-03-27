import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
        'great-vibes': ['var(--font-great-vibes)', 'cursive'],
      },
      colors: {
        ivory:            'var(--bg)',
        'cherry-blossom': 'var(--accent-light)',
        'pink-carnation': 'var(--accent-mid)',
        'berry-crush':    'var(--accent-primary)',
        'cherry-rose':    'var(--grad-start)',
        'dark-amaranth':  'var(--name-color)',
      },
    },
  },
  plugins: [],
}

export default config
