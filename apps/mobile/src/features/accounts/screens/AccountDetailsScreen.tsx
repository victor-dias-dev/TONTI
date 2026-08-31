import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  MoneyText,
  SparkBars,
  StackHeader,
  StatTile,
  TransactionRow,
} from '../../../components';
import {
  useAccount,
  useAccountActivity,
  useAccountTransactions,
  useCategories,
} from '../../../hooks/use-finance';
import { colors } from '../../../theme';
import { findCategory } from '../../../utils/lookups';

export function AccountDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const account = useAccount(id ?? '');
  const activity = useAccountActivity(id ?? '');
  const transactions = useAccountTransactions(id ?? '');
  const categories = useCategories();
  const data = account.data;

  const incomeCents = (transactions.data ?? [])
    .filter((item) => item.type === 'income')
    .reduce((total, item) => addCents(total, item.amountCents), '0');
  const expenseCents = (transactions.data ?? [])
    .filter((item) => item.type === 'expense')
    .reduce((total, item) => addCents(total, item.amountCents), '0');

  return (
    <View style={styles.safe}>
      <StackHeader title={data?.name ?? 'Conta'} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {data ? (
          <>
            <View>
              <AppText variant="caption" color={colors.muted}>
                Saldo
              </AppText>
              <MoneyText cents={data.balanceCents} variant="display" color={colors.primary} />
            </View>
            <View style={styles.stats}>
              <StatTile label="Entradas" cents={incomeCents} icon="arrowDown" />
              <StatTile label="Saídas" cents={expenseCents} icon="arrowUp" />
            </View>
            <Card padding={20}>
              <AppText variant="titleSm" color={colors.primary} style={styles.section}>
                Atividade
              </AppText>
              <SparkBars points={activity.data ?? []} />
            </Card>
            <View>
              <AppText variant="titleSm" color={colors.primary} style={styles.section}>
                Transações
              </AppText>
              <Card padding={8}>
                {(transactions.data ?? []).map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    category={findCategory(categories.data, transaction.categoryId)}
                    onPress={() => router.push(`/transaction/${transaction.id}`)}
                  />
                ))}
              </Card>
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

function addCents(left: string, right: string) {
  return (BigInt(left || '0') + BigInt(right || '0')).toString();
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  stats: { flexDirection: 'row', gap: 8 },
  section: { marginBottom: 12 },
});
