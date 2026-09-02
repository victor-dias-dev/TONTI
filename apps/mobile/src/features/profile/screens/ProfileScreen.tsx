import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, StackHeader } from '../../../components';
import { useProfile } from '../../../hooks/use-finance';
import { useSession } from '../../../hooks/use-session';
import { radius, useColors } from '../../../theme';

const avatar = require('../../../../assets/images/avatar-placeholder.png');

export function ProfileScreen() {
  const colors = useColors();
  const profile = useProfile();
  const { logout, user } = useSession();
  const name = profile.data?.name ?? user?.name ?? '';
  const email = profile.data?.email ?? user?.email ?? '';

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Perfil" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card padding={20} style={styles.hero}>
          <Image
            source={avatar}
            style={[styles.avatar, { borderColor: colors.surface }]}
            accessibilityLabel="Foto de perfil"
          />
          <AppText variant="titleSm" color={colors.text}>
            {name}
          </AppText>
          <AppText variant="body" color={colors.muted}>
            {email}
          </AppText>
        </Card>

        <View style={styles.actions}>
          <ActionRow
            icon="edit"
            title="Editar perfil"
            caption="Atualize suas informações"
            onPress={() => router.push('/profile/edit')}
          />
          <ActionRow
            icon="lock"
            title="Alterar senha"
            caption="Mantenha sua conta segura"
            onPress={() => router.push('/profile/password')}
          />
        </View>

        <Pressable
          onPress={() => void logout()}
          accessibilityRole="button"
          accessibilityLabel="Sair"
          style={({ pressed }) => [
            styles.logout,
            { borderColor: colors.dangerSoft, backgroundColor: colors.surface },
            pressed ? styles.pressed : null,
          ]}
        >
          <Icon name="logout" size={20} color={colors.danger} />
          <AppText variant="label" color={colors.danger}>
            Sair
          </AppText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function ActionRow({
  icon,
  title,
  caption,
  onPress,
}: {
  icon: 'edit' | 'lock';
  title: string;
  caption: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
    >
      <Card padding={20} style={styles.action}>
        <View style={styles.actionLeft}>
          <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
            <Icon name={icon} size={20} color={colors.primaryInk} />
          </View>
          <View>
            <AppText variant="label" color={colors.text}>
              {title}
            </AppText>
            <AppText variant="caption" color={colors.muted}>
              {caption}
            </AppText>
          </View>
        </View>
        <Icon name="chevronRight" size={18} color={colors.mutedSoft} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 24, paddingTop: 8, flexGrow: 1 },
  hero: { borderRadius: radius.lg, alignItems: 'center', gap: 4, paddingVertical: 24 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
    borderWidth: 4,
  },
  actions: { gap: 16 },
  action: {
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    marginTop: 'auto',
    height: 56,
    borderRadius: radius.xxl,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressed: { opacity: 0.85 },
});
