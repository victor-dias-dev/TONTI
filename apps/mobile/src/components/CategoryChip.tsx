import { StyleSheet, View } from 'react-native';
import { radius } from '../theme';
import { useColors } from '../theme';
import { AppText } from './AppText';

interface CategoryChipProps {
  label: string;
}

export function CategoryChip({ label }: CategoryChipProps) {
  const colors = useColors();
  return (
    <View style={[styles.chip, { backgroundColor: colors.chip }]}>
      <AppText variant="micro" color={colors.muted}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
