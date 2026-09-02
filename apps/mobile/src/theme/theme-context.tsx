import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemePreference } from '../domain';
import { setBalancesHidden, setMoneyCurrency } from '../domain/money';
import { usePreferences } from '../hooks/use-preferences';
import { useSession } from '../hooks/use-session';
import { darkColors, lightColors, type ThemeColors } from './colors';

interface ThemeContextValue {
  colors: ThemeColors;
  scheme: 'light' | 'dark';
  preference: ThemePreference;
  hideBalances: boolean;
  currency: string;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightColors,
  scheme: 'light',
  preference: 'system',
  hideBalances: false,
  currency: 'BRL',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useSession();
  const preferences = usePreferences();
  const system = useColorScheme();
  const preference = preferences.data?.theme ?? 'system';
  const scheme: 'light' | 'dark' =
    preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
  const palette = scheme === 'dark' ? darkColors : lightColors;
  const hideBalances = Boolean(isAuthenticated && preferences.data?.hideBalances);
  const currency = isAuthenticated ? (preferences.data?.currency ?? 'BRL') : 'BRL';

  useEffect(() => {
    setBalancesHidden(hideBalances);
    setMoneyCurrency(currency);
  }, [hideBalances, currency]);

  const value: ThemeContextValue = isAuthenticated
    ? { colors: palette, scheme, preference, hideBalances, currency }
    : {
        colors: lightColors,
        scheme: 'light',
        preference: 'system',
        hideBalances: false,
        currency: 'BRL',
      };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useColors(): ThemeColors {
  return useContext(ThemeContext).colors;
}

export function useThemeScheme() {
  return useContext(ThemeContext);
}
