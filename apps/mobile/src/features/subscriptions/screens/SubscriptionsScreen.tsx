import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader, AppText, Card, Icon, MoneyText } from '../../../components';
import type { Subscription, SubscriptionTone } from '../../../domain';
import { formatMoney, formatMoneyCompact } from '../../../domain';
import { useSubscriptions } from '../../../hooks/use-subscriptions';
import { colors, radius, shadows } from '../../../theme';

export function SubscriptionsScreen() {
  const summary = useSubscriptions();
  const data = summary.data;

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <AppText variant="titleLg" color={colors.text}>
            Suas assinaturas
          </AppText>
          <AppText variant="body" color={colors.muted}>
            Gerencie seus pagamentos recorrentes
          </AppText>
        </View>

        {data ? (
          <>
            <View style={styles.insight}>
              <View style={styles.insightIcon}>
                <Icon name="bulb" size={20} color={colors.onPrimary} />
              </View>
              <View style={styles.insightCopy}>
                <AppText variant="titleSm" color={colors.onPrimary}>
                  Insight Tonti
                </AppText>
                <AppText variant="body" color={colors.onPrimary}>
                  {`Você gasta ${formatMoneyCompact(data.insightYearlyCents)} por ano com assinaturas e serviços digitais.`}
                </AppText>
              </View>
            </View>

            <View style={styles.totals}>
              <Card padding={16} style={styles.total}>
                <View style={styles.totalLabel}>
                  <Icon name="calendar" size={16} color={colors.muted} />
                  <AppText variant="label" color={colors.muted}>
                    Mensal
                  </AppText>
                </View>
                <AppText variant="titleMd" color={colors.text}>
                  {formatMoney(data.monthlyCents, { sign: 'never' })}
                </AppText>
              </Card>
              <Card padding={16} style={styles.total}>
                <View style={styles.totalLabel}>
                  <Icon name="repeat" size={16} color={colors.muted} />
                  <AppText variant="label" color={colors.muted}>
                    Anual
                  </AppText>
                </View>
                <AppText variant="titleMd" color={colors.text}>
                  {formatMoney(data.yearlyCents, { sign: 'never' })}
                </AppText>
              </Card>
            </View>

            <View>
              <View style={styles.sectionHead}>
                <AppText variant="titleSm" color={colors.text}>
                  Serviços ativos
                </AppText>
                <Pressable
                  onPress={() =>
                    Alert.alert(
                      'Em breve',
                      'O cadastro de assinaturas estará disponível em uma próxima etapa.',
                    )
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Adicionar"
                >
                  <AppText variant="label" color={colors.primary}>
                    Adicionar
                  </AppText>
                </Pressable>
              </View>
              <View style={styles.list}>
                {data.items.length === 0 ? (
                  <AppText variant="caption" color={colors.muted}>
                    Nenhuma assinatura ativa.
                  </AppText>
                ) : (
                  data.items.map((item) => <SubscriptionRow key={item.id} item={item} />)
                )}
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function SubscriptionRow({ item }: { item: Subscription }) {
  const well = subscriptionWell(item.tone);
  return (
    <Card padding={16}>
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={[styles.serviceIcon, { backgroundColor: well.bg }]}>
            <Icon name={item.icon} size={22} color={well.fg} />
          </View>
          <View>
            <AppText variant="titleSm" color={colors.text}>
              {item.name}
            </AppText>
            <AppText variant="caption" color={colors.muted}>
              {`Próximo dia ${item.nextDay}`}
            </AppText>
          </View>
        </View>
        <MoneyText cents={item.amountCents} variant="heading" color={colors.text} />
      </View>
    </Card>
  );
}

function subscriptionWell(tone: SubscriptionTone) {
  if (tone === 'danger') return { bg: colors.dangerSoft, fg: colors.danger };
  if (tone === 'soft') return { bg: colors.primarySoft, fg: colors.primaryInk };
  return { bg: colors.chip, fg: colors.muted };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  insight: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    ...shadows.card,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCopy: { flex: 1, gap: 4 },
  totals: { flexDirection: 'row', gap: 8 },
  total: { flex: 1, gap: 8 },
  totalLabel: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  list: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
