import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppHeader, AppText, Card, FAB, MonthSelector, TransactionRow } from '../../../components';
import { useAccounts, useCategories, useTransactions } from '../../../hooks/use-finance';
import { colors, radius, shadows } from '../../../theme';
import {
  findAccount,
  findCategory,
  groupTransactionsByDate,
  monthLabel,
} from '../../../utils/lookups';

export function TransactionsScreen() {
  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [cursor, setCursor] = useState({ year: 2026, month: 7 });
  const month = `${cursor.year}-${String(cursor.month + 1).padStart(2, '0')}`;
  const transactions = useTransactions({ month });
  const categories = useCategories();
  const accounts = useAccounts();

  const filtered = useMemo(() => {
    const items = transactions.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.description.toLowerCase().includes(q));
  }, [query, transactions.data]);

  const groups = groupTransactionsByDate(filtered);

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.toolbar}>
          <View style={styles.search}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar"
              placeholderTextColor={colors.mutedSoft}
              accessibilityLabel="Buscar transações"
              style={styles.searchInput}
            />
          </View>
          <Pressable
            onPress={() => setFilterOpen((value) => !value)}
            accessibilityRole="button"
            accessibilityLabel="Filtrar"
            style={[styles.filter, filterOpen ? styles.filterActive : null]}
          >
            <AppText variant="label" color={colors.primary}>
              Filtrar
            </AppText>
          </Pressable>
        </View>

        <MonthSelector
          label={monthLabel(cursor.year, cursor.month)}
          onPrev={() => setCursor((current) => shiftMonth(current, -1))}
          onNext={() => setCursor((current) => shiftMonth(current, 1))}
        />

        {groups.map(([label, items]) => (
          <View key={label}>
            <AppText variant="label" color={colors.muted} style={styles.group}>
              {label}
            </AppText>
            <Card padding={8}>
              {items.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  category={findCategory(categories.data, transaction.categoryId)}
                  accountName={findAccount(accounts.data, transaction.accountId)?.name}
                  showTime
                  onPress={() => router.push(`/transaction/${transaction.id}`)}
                />
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
      <FAB onPress={() => router.push('/transaction/new')} />
    </View>
  );
}

function shiftMonth(current: { year: number; month: number }, delta: number) {
  const date = new Date(current.year, current.month + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 120, gap: 16, paddingTop: 8 },
  toolbar: { flexDirection: 'row', gap: 8 },
  search: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: 'center',
    ...shadows.card,
  },
  searchInput: { fontSize: 14, color: colors.text, fontFamily: 'Inter_400Regular' },
  filter: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    justifyContent: 'center',
    ...shadows.card,
  },
  filterActive: { backgroundColor: colors.primarySoft50 },
  group: { marginBottom: 8, marginLeft: 4 },
});
