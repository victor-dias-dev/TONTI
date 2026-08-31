import { StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';
import { AppText } from './AppText';

interface CategoryChipProps {
  label: string;
}

export function CategoryChip({ label }: CategoryChipProps) {
  return (
    <View style={styles.chip}>
      <AppText variant="micro" color={colors.muted}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
