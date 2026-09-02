import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '../domain';
import { radius } from '../theme';
import { useColors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface StackHeaderProps {
  title: string;
  onBack: () => void;
  close?: boolean;
  onPressNotifications?: () => void;
  titleStart?: boolean;
  rightLabel?: string;
  rightIcon?: IconName;
  onRightPress?: () => void;
}

export function StackHeader({
  title,
  onBack,
  close,
  onPressNotifications,
  titleStart,
  rightLabel,
  rightIcon,
  onRightPress,
}: StackHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.overlay }]}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={[styles.back, { backgroundColor: colors.surfaceMuted }]}
      >
        <Icon name={close ? 'close' : 'chevronLeft'} size={16} color={colors.primary} />
      </Pressable>
      <AppText
        variant="titleSm"
        color={colors.primary}
        style={titleStart ? styles.titleStart : undefined}
      >
        {title}
      </AppText>
      {rightLabel && onRightPress ? (
        <Pressable
          onPress={onRightPress}
          accessibilityRole="button"
          accessibilityLabel={rightLabel}
          style={styles.right}
        >
          {rightIcon ? <Icon name={rightIcon} size={16} color={colors.primary} /> : null}
          <AppText variant="label" color={colors.primary}>
            {rightLabel}
          </AppText>
        </Pressable>
      ) : onPressNotifications ? (
        <Pressable
          onPress={onPressNotifications}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
          style={styles.bell}
        >
          <Icon name="bell" size={18} color={colors.primary} />
        </Pressable>
      ) : titleStart ? null : (
        <View style={styles.back} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStart: { flex: 1, marginLeft: 4 },
  right: {
    minHeight: 40,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
