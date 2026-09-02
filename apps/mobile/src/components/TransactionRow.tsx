import { Pressable, StyleSheet, View } from 'react-native';
import type { Category, Transaction } from '../domain';
import { formatMoney } from '../domain';
import { radius } from '../theme';
import { useThemeScheme } from '../theme';
import { AppText } from './AppText';
import { CategoryChip } from './CategoryChip';
import { Icon } from './Icon';

interface TransactionRowProps {
  transaction: Transaction;
  category?: Category;
  accountName?: string;
  subtitle?: string;
  showTime?: boolean;
  onPress?: () => void;
}

export function TransactionRow({
  transaction,
  category,
  accountName,
  subtitle,
  showTime,
  onPress,
}: TransactionRowProps) {
  const { colors, hideBalances, currency } = useThemeScheme();
  void hideBalances;
  void currency;
  const income = transaction.type === 'income';
  const time = new Date(transaction.occurredAt).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const amount = formatMoney(transaction.amountCents, { sign: income ? 'always' : 'auto' });
  const display = income ? amount : `- ${formatMoney(transaction.amountCents, { sign: 'never' })}`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`${transaction.description} ${display}`}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.surface },
        income ? { borderLeftWidth: 4, borderLeftColor: colors.primary } : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={[styles.icon, { backgroundColor: category?.iconBg ?? colors.chip }]}>
        <Icon
          name={category?.icon ?? 'wallet'}
          size={18}
          color={income ? colors.onPrimary : colors.primary}
        />
      </View>
      <View style={styles.body}>
        <AppText variant="heading">{transaction.description}</AppText>
        {subtitle ? (
          <AppText variant="caption" color={colors.muted}>
            {subtitle}
          </AppText>
        ) : (
          <View style={styles.meta}>
            {category ? <CategoryChip label={category.name} /> : null}
            {accountName ? (
              <AppText variant="caption" color={colors.mutedSoft}>
                {accountName}
              </AppText>
            ) : null}
          </View>
        )}
      </View>
      <View style={styles.amount}>
        <AppText variant="heading" color={income ? colors.income : colors.text} align="right">
          {display}
        </AppText>
        {showTime ? (
          <AppText variant="caption" color={colors.mutedSoft} align="right">
            {time}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pressed: { opacity: 0.7 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, gap: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amount: { alignItems: 'flex-end' },
});
