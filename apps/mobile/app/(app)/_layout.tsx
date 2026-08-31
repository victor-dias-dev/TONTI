import { Redirect, Tabs } from 'expo-router';
import { TabBar } from '../../src/components';
import { useSession } from '../../src/hooks/use-session';
import { useOnboardingStore } from '../../src/stores/onboarding-store';

export default function AppTabsLayout() {
  const { isAuthenticated } = useSession();
  const completed = useOnboardingStore((state) => state.completed);
  const onboardingHydrated = useOnboardingStore((state) => state.isHydrated);

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (onboardingHydrated && !completed) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transações' }} />
      <Tabs.Screen name="planning" options={{ title: 'Planejamento' }} />
      <Tabs.Screen name="accounts" options={{ title: 'Contas' }} />
      <Tabs.Screen name="more" options={{ title: 'Mais' }} />
    </Tabs>
  );
}
