import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  AppHeader,
  AppText,
  Card,
  CategoryBudgetRow,
  GhostButton,
  MoneyText,
  SettingsRow,
} from '../../../components';
import { useCategories, usePlanning } from '../../../hooks/use-finance';
import { colors, useColors } from '../../../theme';
import { findCategory } from '../../../utils/lookups';

export function PlanningScreen() {
  const colors = useColors();
  const planning = usePlanning();
  const categories = useCategories();
  const data = planning.data;

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="titleLg" color={colors.primary}>
          Planejamento
        </AppText>

        <Card padding={0}>
          <SettingsRow
            label="Assinaturas"
            icon="subscription"
            caption="Gerencie pagamentos recorrentes"
            onPress={() => router.push('/(app)/planning/subscriptions')}
          />
        </Card>

        {data ? (
          <>
            <View style={styles.summary}>
              <SummaryTile label="Receita" cents={data.incomeCents} />
              <SummaryTile label="Planejado" cents={data.plannedCents} />
              <SummaryTile label="Restante" cents={data.remainingCents} highlight />
            </View>

            <View style={styles.list}>
              {data.budgets.map((budget) => (
                <CategoryBudgetRow
                  key={budget.id}
                  budget={budget}
                  category={findCategory(categories.data, budget.categoryId)}
                  onPress={() => router.push(`/(app)/planning/${budget.categoryId}`)}
                />
              ))}
            </View>
          </>
        ) : null}

        <GhostButton label="Novo planejamento" onPress={() => router.push('/(app)/planning/new')} />
      </ScrollView>
    </View>
  );
}

function SummaryTile({
  label,
  cents,
  highlight,
}: {
  label: string;
  cents: string;
  highlight?: boolean;
}) {
  return (
    <Card padding={14} style={styles.tile}>
      <AppText variant="caption" color={highlight ? colors.primary : colors.muted} align="center">
        {label}
      </AppText>
      <MoneyText
        cents={cents}
        compact
        variant="heading"
        color={highlight ? colors.primary : colors.text}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  summary: { flexDirection: 'row', gap: 8 },
  tile: { flex: 1, alignItems: 'center', gap: 4 },
  list: { gap: 12 },
});
