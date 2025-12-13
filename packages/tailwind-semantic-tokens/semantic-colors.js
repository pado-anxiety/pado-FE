const colors = require('@nyangtodac/tailwind-design-tokens/colors');

/**
 * 시맨틱 색상 토큰 정의
 * Tailwind CSS 플러그인과 React Native (nativewind) 양쪽에서 사용
 */
const semanticColors = {
  light: {
    // Background colors
    '--bg-page': colors.neutral[100],
    '--bg-primary': colors.primary[500],
    '--bg-destructive': colors.danger[500],
    '--bg-success': colors.success[500],

    // Text colors
    '--text-body': colors.neutral[800],
    '--text-sub': colors.neutral[600],
    '--text-destructive': colors.danger[500],
    '--text-success': colors.success[500],

    // Border colors
    '--border-primary': colors.charcoal[300],
    '--border-destructive': colors.danger[500],
  },
  dark: {
    // Background colors
    '--bg-page': colors.neutral[900],
    '--bg-primary': colors.primary[900],
    '--bg-destructive': colors.danger[900],
    '--bg-success': colors.success[900],

    // Text colors
    '--text-body': colors.neutral[200],
    '--text-sub': colors.neutral[400],
    '--text-destructive': colors.danger[400],
    '--text-success': colors.success[400],

    // Border colors
    '--border-primary': colors.charcoal[700],
    '--border-destructive': colors.danger[400],
  },
};

module.exports = semanticColors;

