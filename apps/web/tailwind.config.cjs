/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [
    require('@pado/tailwind-design-tokens'),
    require('@pado/tailwind-semantic-tokens'),
  ],
  safelist: ['dark'],
  // darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
