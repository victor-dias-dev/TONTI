import { StyleSheet, View } from 'react-native';
import type { IconName, MoneyCents } from '../domain';
import { formatMoneyCompact } from '../domain';
import { colors, radius, shadows } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface StatTileProps {
  label: string;
  cents: MoneyCents;
  icon: IconName;
  emphasized?: boolean;
}

export function StatTile({ label, cents, icon, emphasized }: StatTileProps) {
  return (
    <View style={[styles.tile, emphasized ? styles.emphasized : null]}>
      <Icon name={icon} size={14} color={colors.primary} />
      <AppText variant="caption" color={emphasized ? colors.primary : colors.muted} align="center">
        {label}
      </AppText>
      <AppText variant="heading" color={emphasized ? colors.primary : colors.text} align="center">
        {formatMoneyCompact(cents)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    ...shadows.card,
  },
  emphasized: {
    borderWidth: 2,
    borderColor: 'rgba(0,52,43,0.1)',
  },
});
