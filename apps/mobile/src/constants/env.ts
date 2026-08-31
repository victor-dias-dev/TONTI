import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@tonti/config';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function lanHost(): string | null {
  const hostUri = Constants.expoConfig?.hostUri ?? Constants.linkingUri ?? '';
  const match = hostUri.match(/(\d{1,3}(?:\.\d{1,3}){3})/);
  return match?.[1] ?? null;
}

function resolveApiUrl(): string {
  const lan = lanHost();
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;

  if (fromEnv) {
    if (lan && (fromEnv.includes('localhost') || fromEnv.includes('127.0.0.1'))) {
      return fromEnv.replace('localhost', lan).replace('127.0.0.1', lan);
    }
    if (Platform.OS === 'android' && !lan) {
      return fromEnv.replace('localhost', '10.0.2.2').replace('127.0.0.1', '10.0.2.2');
    }
    return fromEnv;
  }

  if (lan) {
    return `http://${lan}:3000/api/v1`;
  }

  const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${fallbackHost}:3000/api/v1`;
}

export const env = {
  apiUrl: resolveApiUrl(),
  locale: DEFAULT_LOCALE,
  currency: DEFAULT_CURRENCY,
} as const;
