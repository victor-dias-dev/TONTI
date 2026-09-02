import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  Icon,
  InsightBanner,
  MoneyText,
  PrimaryButton,
  ProgressBar,
  StackHeader,
} from '../../../components';
import type { Installment } from '../../../domain';
import { formatMoney } from '../../../domain';
import { useInstallment } from '../../../hooks/use-installments';
import { colors, radius } from '../../../theme';

export function InstallmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const planQuery = useInstallment(id ?? '');
  const plan = planQuery.data;
  const [expanded, setExpanded] = useState(false);
  const visible = plan ? (expanded ? plan.installments : plan.installments.slice(0, 5)) : [];

  return (
    <View style={styles.safe}>
      <StackHeader
        title="Compra parcelada"
        onBack={() => router.back()}
        onPressNotifications={() => router.push('/(app)/more/notifications')}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {plan ? (
          <>
            <Card padding={20} style={styles.heroCard}>
              <View style={styles.hero}>
                <View style={styles.merchantIcon}>
                  <Icon name={plan.icon} size={28} color={colors.muted} />
                </View>
                <AppText variant="titleMd" color={colors.text}>
                  {plan.merchant}
                </AppText>
                <AppText variant="body" color={colors.muted}>
                  {plan.occurredAtLabel}
                </AppText>
                <View style={styles.amount}>
                  <AppText variant="heading" color={colors.muted}>
                    R$
                  </AppText>
                  <AppText variant="display" color={colors.text}>
                    {formatMoney(plan.totalCents, { sign: 'never' }).replace('R$ ', '')}
                  </AppText>
                </View>
                <View style={styles.pill}>
                  <AppText variant="label" color={colors.text}>
                    {`${plan.installmentCount}x de ${formatMoney(plan.installmentCents, { sign: 'never' })}`}
                  </AppText>
                </View>
              </View>
            </Card>

            <Card padding={20} style={styles.round}>
              <View style={styles.progressHead}>
                <AppText variant="titleSm" color={colors.text}>
                  Progresso
                </AppText>
                <AppText variant="label" color={colors.primary}>
                  {`${plan.paidCount} de ${plan.installmentCount} pagas`}
                </AppText>
              </View>
              <ProgressBar
                percent={(plan.paidCount * 100) / plan.installmentCount}
                tone="primary"
              />
              <AppText variant="caption" color={colors.muted} style={styles.progressHint}>
                {`Faltam ${plan.remainingCount} parcelas de ${formatMoney(plan.installmentCents, { sign: 'never' })} (Total: ${formatMoney(plan.remainingCents, { sign: 'never' })})`}
              </AppText>
            </Card>

            <Card padding={20} style={styles.round}>
              <AppText variant="titleSm" color={colors.text} style={styles.listTitle}>
                Parcelas
              </AppText>
              <View>
                {visible.map((item, index) => (
                  <View key={item.id}>
                    <InstallmentRow item={item} />
                    {index < visible.length - 1 ? <View style={styles.divider} /> : null}
                  </View>
                ))}
              </View>
              {plan.installments.length > visible.length ? (
                <Pressable
                  onPress={() => setExpanded(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Ver todas as parcelas"
                  style={styles.more}
                >
                  <AppText variant="label" color={colors.primary}>
                    Ver todas as parcelas
                  </AppText>
                </Pressable>
              ) : null}
            </Card>

            <PrimaryButton
              label="Antecipar parcelas"
              onPress={() =>
                Alert.alert(
                  'Em breve',
                  'A antecipação de parcelas estará disponível em uma próxima etapa.',
                )
              }
            />
          </>
        ) : planQuery.isFetched ? (
          <InsightBanner text="Compra parcelada não encontrada." />
        ) : null}
      </ScrollView>
    </View>
  );
}

function InstallmentRow({ item }: { item: Installment }) {
  const paid = item.status === 'paid';
  const next = item.status === 'next';

  return (
    <View style={[styles.row, paid ? styles.paid : null, next ? styles.next : null]}>
      <View style={styles.rowLeft}>
        {paid ? (
          <View style={styles.check}>
            <Icon name="check" size={16} color={colors.primary} />
          </View>
        ) : (
          <View style={[styles.index, next ? styles.indexNext : styles.indexUpcoming]}>
            <AppText variant="label" color={next ? colors.primary : colors.muted}>
              {String(item.index)}
            </AppText>
          </View>
        )}
        <View>
          <AppText variant="label" color={colors.text}>
            {item.monthLabel}
          </AppText>
          <AppText variant="caption" color={next ? colors.primary : colors.muted}>
            {item.caption}
          </AppText>
        </View>
      </View>
      <View style={styles.rowRight}>
        <MoneyText cents={item.amountCents} variant="heading" color={colors.text} />
        <AppText variant="caption" color={colors.muted} align="right">
          {item.trailingCaption}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  heroCard: { borderRadius: radius.xxl },
  round: { borderRadius: radius.xxl },
  hero: { alignItems: 'center', gap: 8 },
  merchantIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amount: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginTop: 8 },
  pill: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  progressHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressHint: { marginTop: 12 },
  listTitle: { marginBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  paid: { opacity: 0.6 },
  next: {
    backgroundColor: colors.chip,
    marginHorizontal: -20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  rowRight: { alignItems: 'flex-end' },
  check: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  index: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexNext: { borderWidth: 2, borderColor: colors.primary },
  indexUpcoming: { backgroundColor: colors.chip },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  more: { alignItems: 'center', marginTop: 16 },
});
