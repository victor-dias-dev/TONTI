import { Pressable, StyleSheet, View } from 'react-native';
import type { IconName } from '../domain';
import { radius } from '../theme';
import { useColors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface SettingsRowProps {
  label: string;
  icon: IconName;
  caption?: string;
  onPress?: () => void;
}

export function SettingsRow({ label, icon, caption, onPress }: SettingsRowProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && onPress ? styles.pressed : null]}
    >
      <View style={styles.left}>
        <View style={[styles.icon, { backgroundColor: colors.surfaceMuted }]}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <View>
          <AppText variant="heading">{label}</AppText>
          {caption ? (
            <AppText variant="caption" color={colors.muted}>
              {caption}
            </AppText>
          ) : null}
        </View>
      </View>
      <Icon name="chevronRight" size={14} color={colors.mutedSoft} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 73,
  },
  pressed: { opacity: 0.7 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
