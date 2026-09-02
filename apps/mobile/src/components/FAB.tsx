import { Pressable, StyleSheet } from 'react-native';
import { radius, shadows } from '../theme';
import { useColors } from '../theme';
import { Icon } from './Icon';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Nova transação"
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: colors.brand },
        pressed ? styles.pressed : null,
      ]}
    >
      <Icon name="plus" size={18} color={colors.onBrand} />
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
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.fab,
  },
  pressed: { opacity: 0.85 },
});
