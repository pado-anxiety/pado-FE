const colors = require('@nyangtodac/tailwind-design-tokens/colors');

// NOTE: Cache must be cleared if any color token values are modified
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      backgroundColor: {
        page: {
          DEFAULT: colors.neutral[50],
          dark: colors.neutral[950],
        },
        primary: {
          DEFAULT: colors.primary[500],
          dark: colors.primary[900],
        },
        destructive: {
          DEFAULT: colors.danger[500],
          dark: colors.danger[900],
        },
        success: {
          DEFAULT: colors.success[500],
          dark: colors.success[900],
        },
      },
      textColor: {
        body: {
          DEFAULT: colors.neutral[800],
          dark: colors.neutral[200],
        },
        sub: {
          DEFAULT: colors.neutral[600],
          dark: colors.neutral[400],
        },
        destructive: {
          DEFAULT: colors.danger[500],
          dark: colors.danger[400],
        },
        success: {
          DEFAULT: colors.success[500],
          dark: colors.success[400],
        },
      },
      borderColor: {
        primary: {
          DEFAULT: colors.charcoal[300],
          dark: colors.charcoal[700],
        },
        destructive: {
          DEFAULT: colors.danger[500],
          dark: colors.danger[400],
        },
      },
    },
  },
};
