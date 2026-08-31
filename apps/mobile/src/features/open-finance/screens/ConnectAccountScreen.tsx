import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppText, Card, Icon, PrimaryButton } from '../../../components';
import type { ConnectBenefit } from '../../../domain';
import { useConnectBenefits } from '../../../hooks/use-open-finance';
import { colors, radius, shadows } from '../../../theme';

export function ConnectAccountScreen() {
  const insets = useSafeAreaInsets();
  const benefits = useConnectBenefits();

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 140 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Icon name="bank" size={36} color={colors.primary} />
          </View>
          <AppText variant="titleLg" color={colors.text} align="center">
            Conecte suas contas
          </AppText>
          <AppText variant="body" color={colors.muted} align="center">
            Tenha suas finanças organizadas automaticamente em um só lugar.
          </AppText>
        </View>

        <View style={styles.list}>
          {(benefits.data ?? []).map((benefit) => (
            <BenefitCard key={benefit.id} benefit={benefit} />
          ))}
        </View>
      </ScrollView>

      <View style={[styles.cta, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <PrimaryButton
          label="Conectar conta"
          icon="link"
          onPress={() => router.push('/connect-account/select-bank')}
        />
        <View style={styles.secure}>
          <Icon name="lock" size={14} color={colors.mutedSoft} />
          <AppText variant="caption" color={colors.mutedSoft}>
            Conexão segura via Open Finance
          </AppText>
        </View>
      </View>
    </View>
  );
}

function BenefitCard({ benefit }: { benefit: ConnectBenefit }) {
  return (
    <Card padding={20}>
      <View style={styles.benefit}>
        <View style={styles.benefitIcon}>
          <Icon name={benefit.icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.benefitCopy}>
          <AppText variant="titleSm" color={colors.text}>
            {benefit.title}
          </AppText>
          <AppText variant="caption" color={colors.muted}>
            {benefit.description}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, gap: 16, paddingTop: 16 },
  hero: { alignItems: 'center', gap: 12, marginBottom: 16 },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...shadows.card,
  },
  list: { gap: 16 },
  benefit: { gap: 16 },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCopy: { gap: 4 },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
    backgroundColor: colors.background,
  },
  secure: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
});
