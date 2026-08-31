import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  InsightBanner,
  MoneyText,
  ProgressBar,
  StackHeader,
  TransactionRow,
} from '../../../components';
import { formatMoney, percentOf } from '../../../domain';
import { useCategories, useCategoryTransactions, usePlanning } from '../../../hooks/use-finance';
import { colors } from '../../../theme';
import { findCategory } from '../../../utils/lookups';

export function CategoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const categories = useCategories();
  const planning = usePlanning();
  const transactions = useCategoryTransactions(id ?? '');
  const category = findCategory(categories.data, id ?? '');
  const budget = planning.data?.budgets.find((item) => item.categoryId === id);
  const percent = budget ? percentOf(budget.spentCents, budget.plannedCents) : 0;

  return (
    <View style={styles.safe}>
      <StackHeader title={category?.name ?? 'Categoria'} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {budget ? (
          <>
            <Card padding={20}>
              <AppText variant="titleMd" color={colors.primary}>
                {category?.name}
              </AppText>
              <View style={styles.metrics}>
                <View style={styles.metric}>
                  <AppText variant="caption" color={colors.muted}>
                    Gasto
                  </AppText>
                  <MoneyText cents={budget.spentCents} variant="titleSm" />
                </View>
                <View style={styles.metric}>
                  <AppText variant="caption" color={colors.muted}>
                    Orçamento
                  </AppText>
                  <MoneyText cents={budget.plannedCents} variant="titleSm" color={colors.muted} />
                </View>
                <View style={styles.metric}>
                  <AppText variant="caption" color={colors.muted}>
                    Uso
                  </AppText>
                  <AppText variant="titleSm" color={percent > 100 ? colors.danger : colors.primary}>
                    {budget.percentLabel}
                  </AppText>
                </View>
              </View>
              <ProgressBar
                percent={percent}
                tone={percent > 100 ? 'danger' : percent >= 85 ? 'warning' : 'primary'}
              />
              <AppText variant="caption" color={colors.muted} style={styles.caption}>
                {`${formatMoney(budget.spentCents, { sign: 'never' })} de ${formatMoney(budget.plannedCents, { sign: 'never' })}`}
              </AppText>
            </Card>
            <InsightBanner
              text={
                percent > 100
                  ? 'Você já ultrapassou o orçamento desta categoria neste mês.'
                  : `Você já usou ${budget.percentLabel} do orçamento de ${category?.name ?? 'categoria'}.`
              }
            />
          </>
        ) : null}

        <View>
          <AppText variant="titleSm" color={colors.primary} style={styles.section}>
            Transações da categoria
          </AppText>
          <Card padding={8}>
            {(transactions.data ?? []).map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                category={category}
                onPress={() => router.push(`/transaction/${transaction.id}`)}
              />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  metrics: { flexDirection: 'row', marginVertical: 16 },
  metric: { flex: 1, gap: 4 },
  caption: { marginTop: 8 },
  section: { marginBottom: 12 },
});
