import { useCallback, useEffect, useMemo, useState } from 'react';

import { useColorScheme, vars } from 'nativewind';

import semanticColors from '@pado/tailwind-semantic-tokens/semantic-colors';

import { storage } from '../store';

const THEME_KEY = 'theme';

/**
 * hex 색상을 rgba로 변환. 6자리/8자리 hex 모두 지원.
 * 토큰 값이 8자리 hex(#RRGGBBAA)일 수 있으므로 직접 alpha를 붙이면 안 됨.
 */
export function hexToRgba(hex: string, opacity: number): string {
  const clean = hex.replace('#', '').substring(0, 6);
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

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

  const themeStyle =
    colorScheme === 'dark' ? themeVars.dark : themeVars.light;

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
