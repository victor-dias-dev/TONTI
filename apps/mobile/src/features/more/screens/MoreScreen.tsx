import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader, AppText, Card, SettingsRow } from '../../../components';
import type { IconName } from '../../../domain';
import { useProfile } from '../../../hooks/use-finance';
import { useSession } from '../../../hooks/use-session';
import { colors, radius } from '../../../theme';

const futureRows: { label: string; icon: IconName }[] = [
  { label: 'Perfil', icon: 'user' },
  { label: 'Categorias', icon: 'grid' },
  { label: 'Preferências', icon: 'settings' },
  { label: 'Notificações', icon: 'bell' },
  { label: 'Segurança', icon: 'lock' },
  { label: 'Assinatura', icon: 'crown' },
  { label: 'Ajuda', icon: 'help' },
];

export function MoreScreen() {
  const profile = useProfile();
  const { logout, user } = useSession();
  const name = profile.data?.name ?? user?.name ?? 'Victor';

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
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
          {futureRows.slice(0, 2).map((row) => (
            <SettingsRow
              key={row.label}
              label={row.label}
              icon={row.icon}
              onPress={() => undefined}
            />
          ))}
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
          {futureRows.slice(2).map((row) => (
            <SettingsRow
              key={row.label}
              label={row.label}
              icon={row.icon}
              onPress={() => undefined}
            />
          ))}
          <SettingsRow label="Sair" icon="logout" onPress={() => void logout()} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20, paddingTop: 8 },
  profile: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
