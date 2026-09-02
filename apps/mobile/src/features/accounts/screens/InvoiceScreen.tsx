import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  Icon,
  MoneyText,
  PrimaryButton,
  StackHeader,
  TransactionRow,
} from '../../../components';
import {
  useCards,
  useCategories,
  useInvoiceByCard,
  useTransactions,
} from '../../../hooks/use-finance';
import { colors, radius } from '../../../theme';
import { findCategory } from '../../../utils/lookups';

export function InvoiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoice = useInvoiceByCard(id ?? '');
  const cards = useCards();
  const transactions = useTransactions();
  const categories = useCategories();
  const data = invoice.data;
  const card = cards.data?.find((item) => item.id === data?.cardId || item.id === id);
  const items = (data?.transactionIds ?? [])
    .map((transactionId) => transactions.data?.find((item) => item.id === transactionId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <View style={styles.safe}>
      <StackHeader title="Fatura Detalhada" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {data ? (
          <>
            <View style={styles.hero}>
              <AppText variant="caption" color={colors.muted}>
                {card?.name ?? 'Fatura'}
              </AppText>
              <MoneyText cents={data.totalCents} variant="display" color={colors.primary} />
              <View style={styles.meta}>
                <View>
                  <AppText variant="caption" color={colors.muted}>
                    Vencimento
                  </AppText>
                  <AppText variant="heading">{data.dueLabel}</AppText>
                </View>
                <View>
                  <AppText variant="caption" color={colors.muted} align="right">
                    Melhor dia
                  </AppText>
                  <AppText variant="heading" align="right">
                    {data.bestPurchaseDayLabel}
                  </AppText>
                </View>
              </View>
            </View>

            <PrimaryButton
              label="Pagar Fatura"
              onPress={() =>
                Alert.alert('Pagamento simulado', 'Esta etapa não processa pagamentos reais.')
              }
            />

            <View>
              <AppText variant="titleSm" color={colors.primary} style={styles.section}>
                Compras da fatura
              </AppText>
              <Card padding={8}>
                {items.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    category={findCategory(categories.data, transaction.categoryId)}
                    onPress={() => router.push(`/transaction/${transaction.id}`)}
                  />
                ))}
              </Card>
            </View>

            <View style={styles.illustration}>
              <Icon name="card" size={64} color={colors.primarySoft} />
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 20,
    gap: 8,
  },
  meta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  section: { marginBottom: 12 },
  illustration: {
    height: 160,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
