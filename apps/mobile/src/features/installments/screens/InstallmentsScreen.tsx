import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, MoneyText, ProgressBar, StackHeader } from '../../../components';
import type { InstallmentPlan, MoneyCents } from '../../../domain';
import { formatMoney } from '../../../domain';
import { useInstallments } from '../../../hooks/use-installments';
import { colors, radius, shadows } from '../../../theme';

export function InstallmentsScreen() {
  const plansQuery = useInstallments();
  const plans = plansQuery.data ?? [];
  const remainingCents = sumCents(plans.map((plan) => plan.remainingCents));
  const monthCents = sumCents(
    plans.map(
      (plan) => plan.installments.find((item) => item.status === 'next')?.amountCents ?? '0',
    ),
  );

  return (
    <View style={styles.safe}>
      <StackHeader title="Compras parceladas" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Card padding={14} style={styles.tile}>
            <AppText variant="caption" color={colors.muted} align="center">
              Restante
            </AppText>
            <MoneyText cents={remainingCents} compact variant="heading" color={colors.primary} />
          </Card>
          <Card padding={14} style={styles.tile}>
            <AppText variant="caption" color={colors.muted} align="center">
              Próximas
            </AppText>
            <MoneyText cents={monthCents} compact variant="heading" />
          </Card>
        </View>

        <AppText variant="caption" color={colors.muted}>
          {plans.length === 1 ? '1 compra ativa' : `${plans.length} compras ativas`}
        </AppText>

        {plans.length === 0 && plansQuery.isFetched ? (
          <AppText variant="caption" color={colors.muted}>
            Nenhuma compra parcelada no momento.
          </AppText>
        ) : (
          plans.map((plan) => <InstallmentPlanCard key={plan.id} plan={plan} />)
        )}
      </ScrollView>
    </View>
  );
}

function InstallmentPlanCard({ plan }: { plan: InstallmentPlan }) {
  return (
    <Pressable
      onPress={() => router.push(`/installment/${plan.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${plan.merchant} parcelamento`}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
    >
      <View style={styles.top}>
        <View style={styles.icon}>
          <Icon name={plan.icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <AppText variant="titleSm" color={colors.primary}>
            {plan.merchant}
          </AppText>
          <AppText variant="caption" color={colors.muted}>
            {`${plan.paidCount} de ${plan.installmentCount} pagas`}
          </AppText>
        </View>
        <Icon name="chevronRight" size={16} color={colors.mutedSoft} />
      </View>
      <View style={styles.row}>
        <View>
          <AppText variant="caption" color={colors.muted}>
            Restante
          </AppText>
          <MoneyText cents={plan.remainingCents} variant="titleSm" color={colors.primary} />
        </View>
        <View>
          <AppText variant="caption" color={colors.muted} align="right">
            Parcelas
          </AppText>
          <AppText variant="heading" align="right">
            {`${plan.installmentCount}x de ${formatMoney(plan.installmentCents, { sign: 'never' })}`}
          </AppText>
        </View>
      </View>
      <ProgressBar percent={(plan.paidCount * 100) / plan.installmentCount} />
    </Pressable>
  );
}

function sumCents(values: MoneyCents[]): MoneyCents {
  return values
    .reduce((total, value) => total + BigInt(value.replace(/[+-]/g, '') || '0'), 0n)
    .toString();
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  summary: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, alignItems: 'center', gap: 4 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 20,
    gap: 16,
    ...shadows.card,
  },
  pressed: { opacity: 0.85 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
});
