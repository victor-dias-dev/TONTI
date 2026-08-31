import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AccountCard, AppHeader, AppText, GhostButton, Icon, MoneyText } from '../../../components';
import { useAccounts, useCards } from '../../../hooks/use-finance';
import { colors, radius, shadows } from '../../../theme';

export function AccountsScreen() {
  const accounts = useAccounts();
  const cards = useCards();

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="titleLg" color={colors.primary}>
          Contas
        </AppText>

        <View style={styles.list}>
          {(accounts.data ?? []).map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onPress={() => router.push(`/(app)/accounts/${account.id}`)}
            />
          ))}
        </View>

        <GhostButton
          label="Adicionar Conta"
          onPress={() =>
            Alert.alert('Em breve', 'O cadastro de contas estará disponível em uma próxima etapa.')
          }
        />

        <View>
          <AppText variant="titleSm" color={colors.primary} style={styles.section}>
            Cartões de Crédito
          </AppText>
          {(cards.data ?? []).map((card) => (
            <Pressable
              key={card.id}
              onPress={() => router.push('/(app)/accounts/cards')}
              accessibilityRole="button"
              accessibilityLabel={card.name}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <View style={styles.icon}>
                  <Icon name="card" size={18} color={colors.primary} />
                </View>
                <View style={styles.cardCopy}>
                  <AppText variant="label">{card.name}</AppText>
                  <AppText variant="caption" color={colors.muted}>
                    {`Fatura • ${card.dueLabel}`}
                  </AppText>
                </View>
              </View>
              <MoneyText cents={card.invoiceCents} variant="titleSm" color={colors.primary} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  list: { gap: 12 },
  section: { marginBottom: 12 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 20,
    marginBottom: 12,
    ...shadows.card,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1 },
});
