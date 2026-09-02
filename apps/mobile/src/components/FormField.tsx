import { type ReactNode } from 'react';
import { Pressable, StyleSheet, TextInput, View, type KeyboardTypeOptions } from 'react-native';
import type { IconName } from '../domain';
import { radius } from '../theme';
import { useColors } from '../theme';
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
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  trailing?: ReactNode;
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
  secureTextEntry,
  autoCapitalize,
  keyboardType,
  trailing,
}: FormFieldProps) {
  const colors = useColors();
  const content = (
    <View
      style={[
        styles.row,
        last
          ? null
          : {
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: colors.chip,
              marginBottom: 12,
            },
      ]}
    >
      <View style={styles.left}>
        <Icon name={icon} size={18} color={colors.muted} />
        {editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder ?? label}
            placeholderTextColor={colors.mutedSoft}
            style={[styles.input, { color: colors.text }]}
            accessibilityLabel={label}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            autoCorrect={false}
          />
        ) : (
          <AppText variant="body" color={colors.muted}>
            {label}
          </AppText>
        )}
      </View>
      {trailing ? (
        <View style={styles.trailing}>{trailing}</View>
      ) : value && !editable ? (
        <View style={[styles.pill, { backgroundColor: colors.surfaceMuted }]}>
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
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  trailing: { marginLeft: 8, flexShrink: 0 },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter_400Regular' },
  pill: {
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
