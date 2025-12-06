const tailwindDesignTokens = require('@nyangtodac/tailwind-design-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset'), tailwindDesignTokens],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
