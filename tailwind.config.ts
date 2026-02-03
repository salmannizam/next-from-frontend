import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: '#18181c',
        border: '#2a2a2e',
        muted: '#a1a1aa',
        accent: '#22c55e',
      },
    },
  },
  plugins: [],
};
export default config;
