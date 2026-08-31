import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import type { IconName } from '../domain';
import { colors, radius, shadows, typography } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  icon?: IconName;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  accessibilityLabel,
  icon,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [
        styles.button,
        shadows.card,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={20} color={colors.onPrimary} /> : null}
          <AppText variant="label" color={colors.onPrimary} style={styles.label}>
            {label}
          </AppText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.xxl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: {
    ...typography.bodySemi,
    color: colors.onPrimary,
    fontSize: 14,
  },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.6 },
});
