import { StyleSheet, View } from 'react-native';
import type { MoneyCents } from '../domain';
import { formatMoney } from '../domain';
import { colors, radius, shadows } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface BalanceCardProps {
  label?: string;
  cents: MoneyCents;
  badge?: string;
}

export function BalanceCard({ label = 'Saldo disponível', cents, badge }: BalanceCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.label}>
          <Icon name="bank" size={16} color={colors.muted} />
          <AppText variant="label" color={colors.muted}>
            {label}
          </AppText>
        </View>
        {badge ? (
          <View style={styles.badge}>
            <Icon name="arrowUp" size={12} color={colors.primaryMuted} />
            <AppText variant="label" color={colors.primaryMuted}>
              {badge}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText variant="display" color={colors.primary}>
        {formatMoney(cents, { sign: 'never' })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 20,
    overflow: 'hidden',
    ...shadows.card,
  },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
