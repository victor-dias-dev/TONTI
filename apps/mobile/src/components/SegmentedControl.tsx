import { Pressable, StyleSheet, View } from 'react-native';
import { radius } from '../theme';
import { useColors } from '../theme';
import { AppText } from './AppText';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const colors = useColors();
  return (
    <View style={[styles.track, { backgroundColor: colors.surfaceMuted }]}>
      {options.map((option) => {
        const active = option.value === value;
        const expense = option.value === 'expense' && active;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option.label}
            style={[
              styles.item,
              active ? { backgroundColor: colors.surface } : null,
              expense ? { backgroundColor: colors.dangerSoft } : null,
            ]}
          >
            <AppText
              variant="label"
              color={expense ? colors.danger : active ? colors.primary : colors.muted}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
});
