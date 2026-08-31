import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '../domain';
import { colors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

const tabs: { name: string; label: string; icon: IconName }[] = [
  { name: 'index', label: 'Início', icon: 'home' },
  { name: 'transactions', label: 'Transações', icon: 'transactions' },
  { name: 'planning', label: 'Planejamento', icon: 'planning' },
  { name: 'accounts', label: 'Contas', icon: 'accounts' },
  { name: 'more', label: 'Mais', icon: 'more' },
];

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    navigate: (name: string) => void;
  };
}

export function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name ?? 'index';
  const activeFamily = activeRoute.startsWith('accounts') ? 'accounts' : activeRoute;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {tabs.map((tab) => {
        const focused =
          activeFamily === tab.name || (tab.name === 'accounts' && activeRoute === 'accounts');
        return (
          <Pressable
            key={tab.name}
            onPress={() => navigation.navigate(tab.name)}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}
            style={[styles.item, focused ? styles.active : null]}
          >
            <Icon
              name={tab.icon}
              size={tab.name === 'planning' ? 20 : 18}
              color={focused ? colors.primary : colors.muted}
            />
            <AppText
              variant="micro"
              color={focused ? colors.primary : colors.muted}
              style={focused ? styles.activeLabel : undefined}
            >
              {tab.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingTop: 6,
    minHeight: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
  },
  active: {
    backgroundColor: colors.primarySoft50,
  },
  activeLabel: {
    fontFamily: 'Inter_600SemiBold',
  },
});
