const tailwindDesignTokens = require('@pado/tailwind-design-tokens');
const tailwindSemanticTokens = require('@pado/tailwind-semantic-tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [
    require('nativewind/preset'),
    tailwindDesignTokens,
    tailwindSemanticTokens,
  ],
  // darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
