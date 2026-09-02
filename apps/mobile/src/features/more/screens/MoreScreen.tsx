import { router } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader, AppText, Card, SettingsRow } from '../../../components';
import { useProfile } from '../../../hooks/use-finance';
import { useSession } from '../../../hooks/use-session';
import { radius, useColors } from '../../../theme';

export function MoreScreen() {
  const colors = useColors();
  const profile = useProfile();
  const { logout, user } = useSession();
  const name = profile.data?.name ?? user?.name ?? 'Victor';

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={[styles.avatar, { backgroundColor: colors.primarySoft }]}>
            <AppText variant="titleMd" color={colors.primary}>
              {name.slice(0, 1)}
            </AppText>
          </View>
          <AppText variant="titleMd" color={colors.primary}>
            {name}
          </AppText>
          <AppText variant="caption" color={colors.muted}>
            {profile.data?.email ?? user?.email ?? ''}
          </AppText>
        </View>

        <Card padding={0}>
          <SettingsRow label="Perfil" icon="user" onPress={() => router.push('/profile')} />
          <SettingsRow label="Categorias" icon="grid" onPress={() => router.push('/categories')} />
          <SettingsRow label="Contas" icon="bank" onPress={() => router.push('/(app)/accounts')} />
          <SettingsRow
            label="Cartões"
            icon="card"
            onPress={() => router.push('/(app)/accounts/cards')}
          />
          <SettingsRow label="Tonti AI" icon="robot" onPress={() => router.push('/assistant')} />
          <SettingsRow
            label="Assinaturas"
            icon="subscription"
            onPress={() => router.push('/(app)/planning/subscriptions')}
          />
          <SettingsRow
            label="Compras parceladas"
            icon="installments"
            onPress={() => router.push('/installment')}
          />
          <SettingsRow
            label="Preferências"
            icon="settings"
            onPress={() => router.push('/preferences')}
          />
          <SettingsRow
            label="Notificações"
            icon="bell"
            onPress={() => router.push('/(app)/more/notifications')}
          />
          <SettingsRow
            label="Segurança"
            icon="lock"
            onPress={() =>
              Alert.alert(
                'Em breve',
                'As opções de segurança estarão disponíveis em uma próxima etapa.',
              )
            }
          />
          <SettingsRow
            label="Assinatura"
            icon="crown"
            onPress={() =>
              Alert.alert('Em breve', 'O plano Tonti estará disponível em uma próxima etapa.')
            }
          />
          <SettingsRow label="Ajuda" icon="help" onPress={() => router.push('/(app)/more/help')} />
          <SettingsRow label="Sair" icon="logout" onPress={() => void logout()} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20, paddingTop: 8 },
  profile: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
