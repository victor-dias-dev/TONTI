import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';
import { AppText } from './AppText';
import { Icon } from './Icon';

const avatar = require('../../assets/images/avatar-placeholder.png');

interface AppHeaderProps {
  onPressNotifications?: () => void;
}

export function AppHeader({ onPressNotifications }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <Image source={avatar} style={styles.avatar} accessibilityLabel="Foto de perfil" />
      <AppText variant="titleMd" color={colors.primary} style={styles.title}>
        Tonti
      </AppText>
      <Pressable
        onPress={onPressNotifications}
        accessibilityRole="button"
        accessibilityLabel="Notificações"
        style={styles.bell}
      >
        <Icon name="bell" size={18} color={colors.primary} />
      </Pressable>
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E6E8E8',
  },
  title: { flex: 1, textAlign: 'center' },
  bell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
