import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { IconName } from '../domain';
import { colors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface FormFieldProps {
  icon: IconName;
  label: string;
  value?: string;
  placeholder?: string;
  editable?: boolean;
  onPress?: () => void;
  onChangeText?: (text: string) => void;
  last?: boolean;
}

export function FormField({
  icon,
  label,
  value,
  placeholder,
  editable,
  onPress,
  onChangeText,
  last,
}: FormFieldProps) {
  const content = (
    <View style={[styles.row, last ? null : styles.border]}>
      <View style={styles.left}>
        <Icon name={icon} size={18} color={colors.muted} />
        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder ?? label}
            placeholderTextColor={colors.mutedSoft}
            style={styles.input}
            accessibilityLabel={label}
          />
        ) : (
          <AppText variant="body" color={colors.muted}>
            {label}
          </AppText>
        )}
      </View>
      {value && !editable ? (
        <View style={styles.pill}>
          <AppText variant="label" color={colors.primary}>
            {value}
          </AppText>
          <Icon name="chevronDown" size={10} color={colors.primary} />
        </View>
      ) : null}
    </View>
  );

  if (onPress && !editable) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 13,
    minHeight: 48,
  },
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.chip,
    marginBottom: 12,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  input: { flex: 1, fontSize: 16, color: colors.text, fontFamily: 'Inter_400Regular' },
  pill: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
