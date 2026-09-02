import { Pressable, StyleSheet, View } from 'react-native';
import type { Account } from '../domain';
import { formatMoney, isNegativeMoney } from '../domain';
import { radius, shadows } from '../theme';
import { useThemeScheme } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface AccountCardProps {
  account: Account;
  onPress?: () => void;
}

export function AccountCard({ account, onPress }: AccountCardProps) {
  const { colors, hideBalances, currency } = useThemeScheme();
  void hideBalances;
  void currency;
  const caption = account.kind === 'cash' ? 'Carteira' : 'Saldo disponível';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={account.name}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface },
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.top}>
        <View style={styles.identity}>
          <View style={[styles.icon, { backgroundColor: colors.surfaceMuted }]}>
            <Icon name={account.icon} size={18} color={colors.primary} />
          </View>
          <AppText variant="label">{account.name}</AppText>
        </View>
        <Icon name="more" size={16} color={colors.mutedSoft} />
      </View>
      <View>
        <AppText variant="caption" color={colors.muted}>
          {caption}
        </AppText>
        <AppText
          variant="titleSm"
          color={isNegativeMoney(account.balanceCents) ? colors.danger : colors.primary}
        >
          {formatMoney(account.balanceCents, { sign: 'auto' })}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
    ...shadows.card,
  },
  pressed: { opacity: 0.8 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
