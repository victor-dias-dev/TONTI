import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, GhostButton, Icon, MoneyText, StackHeader } from '../../../components';
import { formatMoney, percentOf } from '../../../domain';
import { useCards } from '../../../hooks/use-finance';
import { colors, radius, shadows, useColors } from '../../../theme';

export function CardsScreen() {
  const colors = useColors();
  const cards = useCards();

  return (
    <View style={styles.safe}>
      <StackHeader title="Cartões" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {(cards.data ?? []).map((card) => (
          <Pressable
            key={card.id}
            onPress={() => router.push(`/(app)/accounts/invoice/${card.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`${card.name} fatura`}
            style={styles.card}
          >
            <View style={styles.top}>
              <View style={styles.icon}>
                <Icon name="card" size={20} color={colors.primary} />
              </View>
              <View style={styles.copy}>
                <AppText variant="titleSm" color={colors.primary}>
                  {card.name}
                </AppText>
                <AppText variant="caption" color={colors.muted}>
                  {`${card.brand} •••• ${card.lastDigits}`}
                </AppText>
              </View>
            </View>
            <View style={styles.row}>
              <View>
                <AppText variant="caption" color={colors.muted}>
                  Fatura
                </AppText>
                <MoneyText cents={card.invoiceCents} variant="titleSm" color={colors.primary} />
              </View>
              <View>
                <AppText variant="caption" color={colors.muted} align="right">
                  Vencimento
                </AppText>
                <AppText variant="heading" align="right">
                  {card.dueLabel}
                </AppText>
              </View>
            </View>
            <View>
              <View style={styles.row}>
                <AppText variant="caption" color={colors.muted}>
                  Limite
                </AppText>
                <AppText variant="caption" color={colors.muted}>
                  {`${formatMoney(card.usedCents, { sign: 'never' })} / ${formatMoney(card.limitCents, { sign: 'never' })}`}
                </AppText>
              </View>
              <View style={styles.track}>
                <View
                  style={[
                    styles.fill,
                    { width: `${Math.min(percentOf(card.usedCents, card.limitCents), 100)}%` },
                  ]}
                />
              </View>
            </View>
          </Pressable>
        ))}

        <GhostButton
          label="Adicionar Cartão"
          onPress={() => router.push('/(app)/accounts/new-card')}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 20,
    gap: 16,
    ...shadows.card,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    overflow: 'hidden',
    marginTop: 8,
  },
  fill: { height: '100%', backgroundColor: colors.primary, borderRadius: radius.pill },
});
