import { Pressable, StyleSheet, View } from 'react-native';
import type { Budget, Category } from '../domain';
import { formatMoney, percentOf } from '../domain';
import { colors, radius } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

interface CategoryBudgetRowProps {
  budget: Budget;
  category?: Category;
  onPress?: () => void;
}

export function CategoryBudgetRow({ budget, category, onPress }: CategoryBudgetRowProps) {
  const percent = percentOf(budget.spentCents, budget.plannedCents);
  const tone = percent > 100 ? 'danger' : percent >= 85 ? 'warning' : 'primary';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={category?.name ?? 'Categoria'}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.top}>
        <View style={styles.left}>
          <View style={[styles.icon, { backgroundColor: category?.iconBg ?? colors.chip }]}>
            <Icon name={category?.icon ?? 'grid'} size={18} color={colors.primary} />
          </View>
          <View>
            <AppText variant="label">{category?.name}</AppText>
            <AppText variant="caption" color={colors.muted}>
              {`${formatMoney(budget.spentCents, { sign: 'never' })} / ${formatMoney(budget.plannedCents, { sign: 'never' })}`}
            </AppText>
          </View>
        </View>
        <AppText variant="heading" color={tone === 'danger' ? colors.danger : colors.text}>
          {budget.percentLabel}
        </AppText>
      </View>
      <ProgressBar percent={percent} tone={tone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  pressed: { opacity: 0.75 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
