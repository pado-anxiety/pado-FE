import { useColorScheme } from 'nativewind';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

export const useIconColor = () => {
  const { colorScheme } = useColorScheme();
  const tokens = colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;

  return {
    iconPrimary: tokens['--icon-primary'],
    iconSecondary: tokens['--icon-secondary'],
    textPrimary: tokens['--text-primary'],
    textSecondary: tokens['--text-secondary'],
    textTertiary: tokens['--text-tertiary'],
    accent: tokens['--btn-act-page'],
  };
};
