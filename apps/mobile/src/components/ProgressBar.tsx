import { StyleSheet, View } from 'react-native';
import { radius } from '../theme';
import { useColors } from '../theme';

interface ProgressBarProps {
  percent: number;
  tone?: 'primary' | 'warning' | 'danger';
}

export function ProgressBar({ percent, tone = 'primary' }: ProgressBarProps) {
  const colors = useColors();
  const fill =
    tone === 'danger' ? colors.danger : tone === 'warning' ? colors.warning : colors.primary;
  const width = `${Math.max(0, Math.min(percent, 100))}%` as const;

  return (
    <View style={[styles.track, { backgroundColor: colors.track }]}>
      <View style={[styles.fill, { width, backgroundColor: fill }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 12,
    borderRadius: radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
