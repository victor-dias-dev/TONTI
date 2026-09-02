import { StyleSheet, View } from 'react-native';
import type { IconName, MoneyCents } from '../domain';
import { formatMoneyCompact, isNegativeMoney } from '../domain';
import { radius, shadows } from '../theme';
import { useThemeScheme } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface StatTileProps {
  label: string;
  cents: MoneyCents;
  icon: IconName;
  emphasized?: boolean;
  signed?: boolean;
}

export function StatTile({ label, cents, icon, emphasized, signed }: StatTileProps) {
  const { colors, hideBalances, currency } = useThemeScheme();
  void hideBalances;
  void currency;
  const negative = Boolean(signed && isNegativeMoney(cents));
  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: colors.surface },
        emphasized ? { borderWidth: 2, borderColor: colors.primarySoft50 } : null,
      ]}
    >
      <Icon name={icon} size={14} color={negative ? colors.danger : colors.primary} />
      <AppText
        variant="caption"
        color={emphasized ? (negative ? colors.danger : colors.primary) : colors.muted}
        align="center"
      >
        {label}
      </AppText>
      <AppText
        variant="heading"
        color={negative ? colors.danger : emphasized ? colors.primary : colors.text}
        align="center"
      >
        {formatMoneyCompact(cents, { sign: signed ? 'auto' : 'never' })}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    ...shadows.card,
  },
});
