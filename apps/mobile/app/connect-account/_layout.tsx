import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../src/hooks/use-session';

export default function ConnectAccountLayout() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
