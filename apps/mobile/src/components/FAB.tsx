import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, shadows } from '../theme';
import { Icon } from './Icon';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Nova transação"
      style={({ pressed }) => [styles.fab, pressed ? styles.pressed : null]}
    >
      <Icon name="plus" size={18} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },
  pressed: { opacity: 0.85 },
});
