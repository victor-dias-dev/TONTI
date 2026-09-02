import { router, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  useDeleteTransaction,
  useRelatedTransactions,
  useTransaction,
} from '../../../hooks/use-finance';
import { radius, useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { findAccount, findCategory } from '../../../utils/lookups';

export function TransactionDetailsScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const transactionId = id ?? '';
  const transactionQuery = useTransaction(transactionId);
  const related = useRelatedTransactions(transactionId);
  const categories = useCategories();
  const accounts = useAccounts();
  const remove = useDeleteTransaction();
  const transaction = transactionQuery.data;
  const category = transaction ? findCategory(categories.data, transaction.categoryId) : undefined;
  const account = transaction ? findAccount(accounts.data, transaction.accountId) : undefined;
  const income = transaction?.type === 'income';

  function confirmDelete() {
    if (!transactionId) return;
    Alert.alert('Excluir transação', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          remove.mutate(transactionId, {
            onSuccess: () => router.replace('/(app)/transactions'),
          }),
      },
    ]);
  }

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader
        title="Detalhes"
        onBack={() => router.back()}
        rightLabel={transaction ? 'Editar' : undefined}
        rightIcon="edit"
        onRightPress={
          transaction ? () => router.push(`/transaction/${transaction.id}/edit`) : undefined
        }
      />
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

            {remove.error ? (
              <AppText variant="caption" color={colors.danger}>
                {getErrorMessage(remove.error)}
              </AppText>
            ) : null}

            <Pressable
              onPress={confirmDelete}
              disabled={remove.isPending}
              accessibilityRole="button"
              accessibilityLabel="Excluir transação"
              style={({ pressed }) => [
                styles.delete,
                { backgroundColor: colors.dangerSoft20 },
                pressed ? styles.pressed : null,
              ]}
            >
              <Icon name="trash" size={18} color={colors.danger} />
              <AppText variant="label" color={colors.danger}>
                Excluir transação
              </AppText>
            </Pressable>
          </>
        ) : transactionQuery.isError ? (
          <InsightBanner text="Transação não encontrada." />
        ) : null}
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  const colors = useColors();
  return (
    <View
      style={[
        styles.detail,
        last ? null : [styles.detailBorder, { borderBottomColor: colors.chip }],
      ]}
    >
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
  safe: { flex: 1 },
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
  detailBorder: { borderBottomWidth: StyleSheet.hairlineWidth },
  delete: {
    alignSelf: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: { opacity: 0.85 },
});
