import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'tonti.auth.token';

export const tokenStorage = {
  get(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  set(token: string): Promise<void> {
    return SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  delete(): Promise<void> {
    return SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};
