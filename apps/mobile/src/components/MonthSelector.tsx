import { Pressable, StyleSheet, View } from 'react-native';
import { radius, shadows } from '../theme';
import { useColors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface MonthSelectorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}

export function MonthSelector({ label, onPrev, onNext }: MonthSelectorProps) {
  const colors = useColors();
  return (
    <View style={[styles.wrap, { backgroundColor: colors.overlay }]}>
      <Pressable
        onPress={onPrev}
        accessibilityRole="button"
        accessibilityLabel="Mês anterior"
        style={styles.arrow}
      >
        <Icon name="chevronLeft" size={16} color={colors.primary} />
      </Pressable>
      <AppText variant="label" color={colors.primary}>
        {label}
      </AppText>
      <Pressable
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel="Próximo mês"
        style={styles.arrow}
      >
        <Icon name="chevronRight" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...shadows.card,
  },
  arrow: { padding: 8 },
});
