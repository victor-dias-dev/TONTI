import { StyleSheet, View } from 'react-native';
import type { UpcomingPayment } from '../domain';
import { formatMoney } from '../domain';
import { colors, radius } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface UpcomingPaymentRowProps {
  payment: UpcomingPayment;
  last?: boolean;
}

export function UpcomingPaymentRow({ payment, last }: UpcomingPaymentRowProps) {
  return (
    <View style={[styles.row, last ? null : styles.border]}>
      <View style={styles.icon}>
        <Icon name={payment.icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <AppText variant="label">{payment.title}</AppText>
        <AppText variant="caption" color={colors.muted}>
          {payment.dueLabel}
        </AppText>
      </View>
      <AppText variant="heading">{`- ${formatMoney(payment.amountCents, { sign: 'never' })}`}</AppText>
    </View>
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
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
});
