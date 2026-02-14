import { useCallback, useEffect, useMemo, useState } from 'react';

import { useColorScheme, vars } from 'nativewind';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

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
    const stored = storage.getString(THEME_KEY) as ThemeType | undefined;
    const theme = stored ?? 'system';
    setColorScheme(theme);
  }, [setColorScheme]);

  const [storedTheme, setStoredTheme] = useState<ThemeType>(
    () => (storage.getString(THEME_KEY) as ThemeType) ?? 'system',
  );

  const changeTheme = useCallback(
    (newTheme: ThemeType) => {
      setColorScheme(newTheme);
      storage.set(THEME_KEY, newTheme);
      setStoredTheme(newTheme);
    },
    [setColorScheme],
  );

  const themeStyle = useMemo(() => {
    return colorScheme === 'dark' ? themeVars.dark : themeVars.light;
  }, [colorScheme]);

  const pageBgColor = useMemo(() => {
    const tokens =
      colorScheme === 'dark' ? semanticColors.dark : semanticColors.light;
    return tokens['--bg-page'];
  }, [colorScheme]);

  return {
    theme: colorScheme,
    storedTheme,
    themeStyle,
    pageBgColor,
    changeTheme,
  };
};
