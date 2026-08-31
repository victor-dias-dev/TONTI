import { Redirect, router } from 'expo-router';
import { OnboardingScreen } from '../src/features/onboarding/screens/OnboardingScreen';
import { useSession } from '../src/hooks/use-session';
import { useOnboardingStore } from '../src/stores/onboarding-store';

export default function OnboardingRoute() {
  const { isAuthenticated } = useSession();
  const completed = useOnboardingStore((state) => state.completed);
  const complete = useOnboardingStore((state) => state.complete);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (completed) {
    return <Redirect href="/(app)" />;
  }

  return (
    <OnboardingScreen
      onComplete={() => {
        void complete().then(() => router.replace('/(app)'));
      }}
    />
  );
}
