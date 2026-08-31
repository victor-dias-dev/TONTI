import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';
import type { IconName } from '../domain';

interface GhostButtonProps {
  label: string;
  onPress: () => void;
  icon?: IconName;
  accessibilityLabel?: string;
}

export function GhostButton({
  label,
  onPress,
  icon = 'plus',
  accessibilityLabel,
}: GhostButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <Icon name={icon} size={14} color={colors.primary} />
      <AppText variant="label" color={colors.primary}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  pressed: { opacity: 0.75 },
});
