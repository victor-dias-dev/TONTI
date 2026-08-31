import { StyleSheet, View } from 'react-native';
import type { AccountActivityPoint } from '../domain';
import { colors, radius } from '../theme';
import { AppText } from './AppText';

interface SparkBarsProps {
  points: AccountActivityPoint[];
}

export function SparkBars({ points }: SparkBarsProps) {
  const max = points.reduce((highest, point) => {
    const value = BigInt(point.cents.replace(/[+-]/g, '') || '0');
    return value > highest ? value : highest;
  }, 0n);

  return (
    <View style={styles.row} accessibilityLabel="Atividade da conta">
      {points.map((point) => {
        const value = BigInt(point.cents.replace(/[+-]/g, '') || '0');
        const height = max === 0n ? 8 : Number((value * 96n) / max);
        return (
          <View key={point.id} style={styles.col}>
            <View style={styles.track}>
              <View style={[styles.bar, { height: Math.max(8, height) }]} />
            </View>
            <AppText variant="micro" color={colors.muted} align="center">
              {point.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 128 },
  col: { flex: 1, alignItems: 'center', gap: 8 },
  track: { flex: 1, width: '100%', justifyContent: 'flex-end' },
  bar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    minHeight: 8,
  },
});
