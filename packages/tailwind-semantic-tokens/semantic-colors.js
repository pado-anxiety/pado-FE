const colors = require('@nyangtodac/tailwind-design-tokens/colors');

const semanticColors = {
  light: {
    // Background colors
    '--bg-page': colors.neutral[100],
    '--bg-surface': colors.white,
    '--bg-primary': colors.primary[500],
    '--bg-secondary': colors.neutral[200],
    '--bg-destructive': colors.danger[500],
    '--bg-success': colors.success[500],
    '--bg-warning': colors.warning[500],

    // Chat specific backgrounds
    '--bg-chat-overlay': 'rgba(0, 0, 0, 0.88)',
    '--bg-chat-assistant': colors.neutral[900],
    '--bg-chat-user': colors.neutral[750],

    // Text colors
    '--text-primary': colors.neutral[900],
    '--text-secondary': colors.neutral[700],
    '--text-tertiary': colors.neutral[500],
    '--text-inverse': colors.white,
    '--text-destructive': colors.danger[500],
    '--text-success': colors.success[600],
    '--text-warning': colors.warning[600],

    // Chat text colors
    '--text-chat-assistant': colors.white,
    '--text-chat-user': colors.neutral[900],

    // Border colors
    '--border-primary': colors.neutral[300],
    '--border-secondary': colors.neutral[200],
    '--border-focus': colors.primary[500],
    '--border-destructive': colors.danger[500],
    '--border-success': colors.success[500],

    // Button colors
    '--btn-primary-bg': colors.primary[500],
    '--btn-primary-text': colors.white,
    '--btn-primary-hover': colors.primary[600],
    '--btn-secondary-bg': colors.neutral[200],
    '--btn-secondary-text': colors.neutral[900],
    '--btn-secondary-hover': colors.neutral[300],
    '--btn-destructive-bg': colors.danger[500],
    '--btn-destructive-text': colors.white,
    '--btn-destructive-hover': colors.danger[600],

    // Input colors
    '--input-bg': colors.white,
    '--input-border': colors.neutral[300],
    '--input-border-focus': colors.primary[500],
    '--input-text': colors.neutral[900],
    '--input-placeholder': colors.neutral[500],
    '--input-disabled-bg': colors.neutral[100],
    '--input-disabled-text': colors.neutral[400],

    // CBT content colors
    '--cbt-cognitive': colors.pink[200],
    '--cbt-breathing': colors.lavender[200],
    '--cbt-diary': colors.primary[200],
    '--cbt-learning': colors.peach[200],
    '--cbt-grounding': colors.cream[200],

    // Shadow colors
    '--shadow-sm': 'rgba(42, 40, 37, 0.05)',
    '--shadow-md': 'rgba(42, 40, 37, 0.1)',
    '--shadow-lg': 'rgba(42, 40, 37, 0.15)',
    '--shadow-xl': 'rgba(42, 40, 37, 0.2)',
  },

  dark: {
    // Background colors
    '--bg-page': colors.dark[600],
    '--bg-surface': colors.dark[500],
    '--bg-primary': colors.primary[700],
    '--bg-secondary': colors.dark[700],
    '--bg-destructive': colors.danger[700],
    '--bg-success': colors.success[700],
    '--bg-warning': colors.warning[700],

    // Chat specific backgrounds
    '--bg-chat-overlay': 'rgba(16, 22, 28, 0.95)',
    '--bg-chat-assistant': colors.chat.assistant[500],
    '--bg-chat-user': colors.chat.user[700],

    // Text colors
    '--text-primary': colors.white,
    '--text-secondary': colors.neutral[300],
    '--text-tertiary': colors.neutral[500],
    '--text-inverse': colors.neutral[900],
    '--text-destructive': colors.danger[400],
    '--text-success': colors.success[400],
    '--text-warning': colors.warning[400],

    // Chat text colors
    '--text-chat-assistant': colors.white,
    '--text-chat-user': colors.white,

    // Border colors
    '--border-primary': colors.dark[400],
    '--border-secondary': colors.dark[300],
    '--border-focus': colors.primary[400],
    '--border-destructive': colors.danger[400],
    '--border-success': colors.success[400],

    // Button colors
    '--btn-primary-bg': colors.primary[600],
    '--btn-primary-text': colors.white,
    '--btn-primary-hover': colors.primary[700],
    '--btn-secondary-bg': colors.dark[400],
    '--btn-secondary-text': colors.white,
    '--btn-secondary-hover': colors.dark[300],
    '--btn-destructive-bg': colors.danger[600],
    '--btn-destructive-text': colors.white,
    '--btn-destructive-hover': colors.danger[700],

    // Input colors
    '--input-bg': colors.dark[500],
    '--input-border': colors.dark[400],
    '--input-border-focus': colors.primary[500],
    '--input-text': colors.white,
    '--input-placeholder': colors.neutral[500],
    '--input-disabled-bg': colors.dark[700],
    '--input-disabled-text': colors.neutral[600],

    // CBT content colors
    '--cbt-cognitive': colors.pink[300],
    '--cbt-breathing': colors.lavender[300],
    '--cbt-diary': colors.primary[300],
    '--cbt-learning': colors.peach[300],
    '--cbt-grounding': colors.cream[300],

    // Shadow colors
    '--shadow-sm': 'rgba(0, 0, 0, 0.1)',
    '--shadow-md': 'rgba(0, 0, 0, 0.2)',
    '--shadow-lg': 'rgba(0, 0, 0, 0.3)',
    '--shadow-xl': 'rgba(0, 0, 0, 0.4)',
  },
};

module.exports = semanticColors;
