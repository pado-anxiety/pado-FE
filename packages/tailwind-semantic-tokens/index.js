const plugin = require('tailwindcss/plugin');
const semanticColors = require('./semantic-colors');

// NOTE: Cache must be cleared if any color token values are modified
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        page: 'var(--bg-page)',
        primary: 'var(--bg-primary)',
        destructive: 'var(--bg-destructive)',
        success: 'var(--bg-success)',
      },
      textColor: {
        body: 'var(--text-body)',
        sub: 'var(--text-sub)',
        destructive: 'var(--text-destructive)',
        success: 'var(--text-success)',
      },
      borderColor: {
        primary: 'var(--border-primary)',
        destructive: 'var(--border-destructive)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': semanticColors.light,
        '.dark': semanticColors.dark,
      });
    }),
  ],
};
