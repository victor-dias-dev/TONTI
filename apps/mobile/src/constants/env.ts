import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@tonti/config';
import { Platform } from 'react-native';

function resolveApiUrl(): string {
  const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  const fallback = `http://${fallbackHost}:3000/api/v1`;
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;

  if (!fromEnv) {
    return fallback;
  }

  if (Platform.OS === 'android') {
    return fromEnv.replace('localhost', '10.0.2.2').replace('127.0.0.1', '10.0.2.2');
  }

  return fromEnv;
}

export const env = {
  apiUrl: resolveApiUrl(),
  locale: DEFAULT_LOCALE,
  currency: DEFAULT_CURRENCY,
} as const;
