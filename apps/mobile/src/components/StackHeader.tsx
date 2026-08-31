import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

interface StackHeaderProps {
  title: string;
  onBack: () => void;
  close?: boolean;
  onPressNotifications?: () => void;
}

export function StackHeader({ title, onBack, close, onPressNotifications }: StackHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        style={styles.back}
      >
        <Icon name={close ? 'close' : 'chevronLeft'} size={16} color={colors.primary} />
      </Pressable>
      <AppText variant="titleSm" color={colors.primary}>
        {title}
      </AppText>
      {onPressNotifications ? (
        <Pressable
          onPress={onPressNotifications}
          accessibilityRole="button"
          accessibilityLabel="Notificações"
          style={styles.bell}
        >
          <Icon name="bell" size={18} color={colors.primary} />
        </Pressable>
      ) : (
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
    backgroundColor: colors.overlay,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
