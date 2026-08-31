import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  AppHeader,
  AppText,
  BalanceCard,
  Card,
  FAB,
  InsightBanner,
  ProgressBar,
  StatTile,
  TransactionRow,
  UpcomingPaymentRow,
} from '../../../components';
import { formatMoney, percentOf } from '../../../domain';
import {
  useAccounts,
  useCategories,
  useDashboard,
  useTransactions,
} from '../../../hooks/use-finance';
import { useSession } from '../../../hooks/use-session';
import { colors } from '../../../theme';
import { findCategory, firstName } from '../../../utils/lookups';

export function HomeScreen() {
  const { user } = useSession();
  const dashboard = useDashboard();
  const transactions = useTransactions();
  const categories = useCategories();
  const accounts = useAccounts();
  const data = dashboard.data;

  const recent = (data?.recentTransactionIds ?? [])
    .map((id) => transactions.data?.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <AppText variant="titleLg" color={colors.primary}>
            {`Bom dia, ${firstName(user?.name)} 👋`}
          </AppText>
          <AppText variant="body" color={colors.muted}>
            {data?.monthLabel ?? 'Agosto 2026'}
          </AppText>
        </View>

        {data ? (
          <>
            <BalanceCard cents={data.balanceCents} badge={data.variationLabel} />
            <View style={styles.stats}>
              <StatTile label="Entradas" cents={data.incomeCents} icon="arrowDown" />
              <StatTile label="Saídas" cents={data.expenseCents} icon="arrowUp" />
              <StatTile label="Disponível" cents={data.availableCents} icon="wallet" emphasized />
            </View>
            <InsightBanner text={data.insight.text} />
            <Card padding={20}>
              <View style={styles.spentHead}>
                <AppText variant="titleSm" color={colors.primary}>
                  Gastos do mês
                </AppText>
                <AppText variant="label" color={colors.muted}>
                  {`${formatMoney(data.spentCents, { sign: 'never' })} / ${formatMoney(data.spentLimitCents, { sign: 'never' })}`}
                </AppText>
              </View>
              <ProgressBar percent={percentOf(data.spentCents, data.spentLimitCents)} />
            </Card>
            <View>
              <AppText variant="titleSm" color={colors.primary} style={styles.section}>
                Próximos pagamentos
              </AppText>
              <Card padding={8}>
                {data.upcoming.map((payment, index) => (
                  <UpcomingPaymentRow
                    key={payment.id}
                    payment={payment}
                    last={index === data.upcoming.length - 1}
                  />
                ))}
              </Card>
            </View>
            <View>
              <View style={styles.row}>
                <AppText variant="titleSm" color={colors.primary}>
                  Últimas transações
                </AppText>
                <Pressable
                  onPress={() => router.push('/(app)/transactions')}
                  accessibilityRole="button"
                >
                  <AppText variant="label" color={colors.primary}>
                    Ver todas
                  </AppText>
                </Pressable>
              </View>
              <Card padding={8}>
                {recent.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    category={findCategory(categories.data, transaction.categoryId)}
                    accountName={
                      accounts.data?.find((item) => item.id === transaction.accountId)?.name
                    }
                    subtitle={`${findCategory(categories.data, transaction.categoryId)?.name ?? ''} • ${relativeLabel(transaction.occurredAt)}`}
                    onPress={() => router.push(`/transaction/${transaction.id}`)}
                  />
                ))}
              </Card>
            </View>
          </>
        ) : null}
      </ScrollView>
      <FAB onPress={() => router.push('/transaction/new')} />
    </View>
  );
}

function relativeLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 120, gap: 16, paddingTop: 8 },
  stats: { flexDirection: 'row', gap: 8 },
  spentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  section: { marginBottom: 12 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});
