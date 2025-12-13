import { useCallback, useEffect, useMemo } from 'react';

import { useColorScheme, vars } from 'nativewind';

import semanticColors from '@nyangtodac/tailwind-semantic-tokens/semantic-colors';

import { storage } from '../store';

const THEME_KEY = 'theme';

type ThemeType = 'light' | 'dark' | 'system';

const themeVars = {
  light: vars(semanticColors.light),
  dark: vars(semanticColors.dark),
};

export const useTheme = () => {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    const savedTheme = storage.getString(THEME_KEY) ?? 'light';
    setColorScheme(savedTheme as ThemeType);
  }, [setColorScheme]);

  const changeTheme = useCallback(
    (newTheme: ThemeType) => {
      setColorScheme(newTheme);
      storage.set(THEME_KEY, newTheme);
    },
    [setColorScheme],
  );

  const themeStyle = useMemo(() => {
    return colorScheme === 'dark' ? themeVars.dark : themeVars.light;
  }, [colorScheme]);

  return {
    theme: colorScheme,
    themeStyle,
    changeTheme,
  };
};
