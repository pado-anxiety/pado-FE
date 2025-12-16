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
        'chat-overlay': 'var(--bg-chat-overlay)',
        'chat-assistant': 'var(--bg-chat-assistant)',
        'chat-user': 'var(--bg-chat-user)',
        input: 'var(--input-bg)',
        'input-disabled': 'var(--input-disabled-bg)',
      },
      textColor: {
        body: 'var(--text-body)',
        sub: 'var(--text-sub)',
        destructive: 'var(--text-destructive)',
        success: 'var(--text-success)',
        'chat-assistant': 'var(--text-chat-assistant)',
        'chat-user': 'var(--text-chat-user)',
        input: 'var(--input-text)',
        'input-placeholder': 'var(--input-placeholder)',
        'input-disabled': 'var(--input-disabled-text)',
      },
      borderColor: {
        primary: 'var(--border-primary)',
        destructive: 'var(--border-destructive)',
        input: 'var(--input-border)',
        'input-focus': 'var(--input-border-focus)',
      },
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': semanticColors.light,
        ':root.dark': semanticColors.dark,
      });
    }),
  ],
};
