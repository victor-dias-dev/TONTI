import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  Icon,
  InsightBanner,
  MoneyText,
  StackHeader,
  TransactionRow,
} from '../../../components';
import { formatMoney } from '../../../domain';
import {
  useAccounts,
  useCategories,
  useRelatedTransactions,
  useTransaction,
} from '../../../hooks/use-finance';
import { colors, radius } from '../../../theme';
import { findAccount, findCategory } from '../../../utils/lookups';

export function TransactionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const transactionQuery = useTransaction(id ?? '');
  const related = useRelatedTransactions(id ?? '');
  const categories = useCategories();
  const accounts = useAccounts();
  const transaction = transactionQuery.data;
  const category = transaction ? findCategory(categories.data, transaction.categoryId) : undefined;
  const account = transaction ? findAccount(accounts.data, transaction.accountId) : undefined;
  const income = transaction?.type === 'income';

  return (
    <View style={styles.safe}>
      <StackHeader title="Detalhes" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {transaction ? (
          <>
            <View style={styles.hero}>
              <View style={[styles.icon, { backgroundColor: category?.iconBg ?? colors.chip }]}>
                <Icon name={category?.icon ?? 'wallet'} size={28} color={colors.primary} />
              </View>
              <AppText variant="titleMd" color={colors.primary} align="center">
                {transaction.description}
              </AppText>
              <AppText variant="label" color={colors.muted}>
                {category?.name ?? ''}
              </AppText>
              <MoneyText
                cents={transaction.amountCents}
                signed
                income={income}
                variant="display"
                color={income ? colors.incomeValue : colors.text}
              />
            </View>

            <Card padding={16}>
              <DetailRow label="Data" value={formatDateTime(transaction.occurredAt)} />
              <DetailRow label="Conta" value={account?.name ?? ''} />
              <DetailRow
                label="Valor"
                value={formatMoney(transaction.amountCents, { sign: 'never' })}
                last={!transaction.notes}
              />
              {transaction.notes ? (
                <DetailRow label="Observações" value={transaction.notes} last />
              ) : null}
            </Card>

            {related.data && related.data.length > 0 ? (
              <View>
                <AppText variant="titleSm" color={colors.primary} style={styles.section}>
                  Transações relacionadas
                </AppText>
                <Card padding={8}>
                  {related.data.map((item) => (
                    <TransactionRow
                      key={item.id}
                      transaction={item}
                      category={findCategory(categories.data, item.categoryId)}
                      onPress={() => router.push(`/transaction/${item.id}`)}
                    />
                  ))}
                </Card>
              </View>
            ) : null}

            <View style={styles.illustration}>
              <Icon name={category?.icon ?? 'food'} size={64} color={colors.primarySoft} />
            </View>
          </>
        ) : transactionQuery.isError ? (
          <InsightBanner text="Transação não encontrada." />
        ) : null}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detail, last ? null : styles.detailBorder]}>
      <AppText variant="caption" color={colors.muted}>
        {label}
      </AppText>
      <AppText variant="heading">{value}</AppText>
    </View>
  );
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 20 },
  hero: { alignItems: 'center', gap: 8, paddingTop: 8 },
  icon: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginBottom: 12 },
  detail: { paddingVertical: 12, gap: 4 },
  detailBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.chip },
  illustration: {
    height: 160,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
