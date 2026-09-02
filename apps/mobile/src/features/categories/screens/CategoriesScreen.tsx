import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, SegmentedControl, StackHeader } from '../../../components';
import type { Category } from '../../../domain';
import { useCategories } from '../../../hooks/use-finance';
import { radius, shadows, useColors } from '../../../theme';

type Tab = 'despesas' | 'receitas';

const tabs: { value: Tab; label: string }[] = [
  { value: 'despesas', label: 'Despesas' },
  { value: 'receitas', label: 'Receitas' },
];

export function CategoriesScreen() {
  const colors = useColors();
  const catalog = useCategories();
  const [tab, setTab] = useState<Tab>('despesas');
  const kind = tab === 'despesas' ? 'expense' : 'income';
  const items = useMemo(
    () => (catalog.data ?? []).filter((item) => item.type === kind),
    [catalog.data, kind],
  );

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader
        title="Categorias"
        onBack={() => router.back()}
        rightLabel="Nova"
        rightIcon="plus"
        onRightPress={() => router.push({ pathname: '/categories/new', params: { type: kind } })}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SegmentedControl options={tabs} value={tab} onChange={setTab} />
        <View style={styles.list}>
          {items.map((item) => (
            <CategoryRow key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function CategoryRow({ item }: { item: Category }) {
  const colors = useColors();
  const count = item.transactionCount ?? 0;
  const countLabel = count === 1 ? '1 transação este mês' : `${count} transações este mês`;

  return (
    <Pressable
      onPress={() => router.push(`/categories/${item.id}`)}
      accessibilityRole="button"
      accessibilityLabel={item.name}
      style={({ pressed }) => [pressed ? styles.pressed : null]}
    >
      <Card padding={16} style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.icon, { backgroundColor: item.iconBg }]}>
            <Icon name={item.icon} size={24} color={colors.primary} />
          </View>
          <View style={styles.copy}>
            <AppText variant="titleSm" color={colors.text}>
              {item.name}
            </AppText>
            <AppText variant="caption" color={colors.muted}>
              {countLabel}
            </AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 24, paddingTop: 8 },
  list: { gap: 16 },
  card: { borderRadius: radius.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1, gap: 2 },
  pressed: { opacity: 0.85, ...shadows.card },
});
