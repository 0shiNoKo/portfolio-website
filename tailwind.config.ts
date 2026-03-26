import type { Config } from 'tailwindcss'

const config: Config = {
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
        ivory: '#fff9eb',
        'cherry-blossom': '#ffb9cf',
        'pink-carnation': '#ff78b3',
        'berry-crush': '#bd3c6d',
        'cherry-rose': '#9c1e4a',
        'dark-amaranth': '#7b0027',
      },
    },
  },
  plugins: [],
}

export default config
