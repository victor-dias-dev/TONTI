import { Redirect, Stack } from 'expo-router';
import { useSession } from '../../src/hooks/use-session';

export default function AssistantLayout() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
