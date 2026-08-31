import { Redirect } from 'expo-router';
import { useOnboardingStore } from '../src/stores/onboarding-store';
import { useSession } from '../src/hooks/use-session';

export default function IndexScreen() {
  const { isAuthenticated, isHydrated } = useSession();
  const completed = useOnboardingStore((state) => state.completed);
  const onboardingHydrated = useOnboardingStore((state) => state.isHydrated);

  if (!isHydrated || !onboardingHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (!completed) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(app)" />;
}
