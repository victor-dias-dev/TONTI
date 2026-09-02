import { SUPPORTED_CURRENCIES } from '@tonti/config';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, Icon, SelectSheet, StackHeader } from '../../../components';
import type { IconName, ThemePreference, UserPreferences } from '../../../domain';
import { usePreferences, useUpdatePreferences } from '../../../hooks/use-preferences';
import { radius, shadows, useColors } from '../../../theme';

const themeOptions = [
  { id: 'system', label: 'Sistema' },
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Escuro' },
];

const currencyLabels: Record<string, string> = {
  BRL: 'BRL - Real brasileiro',
  USD: 'USD - Dólar americano',
  EUR: 'EUR - Euro',
};

const currencyOptions = SUPPORTED_CURRENCIES.map((id) => ({
  id,
  label: currencyLabels[id] ?? id,
}));

const periodOptions = [
  { id: '1', label: 'Inicia dia 1º de cada mês' },
  { id: '15', label: 'Inicia dia 15 de cada mês' },
];

type Picker = 'theme' | 'currency' | 'period' | null;

function periodLabel(day: number) {
  return (
    periodOptions.find((item) => item.id === String(day))?.label ?? `Inicia dia ${day} de cada mês`
  );
}

export function PreferencesScreen() {
  const colors = useColors();
  const query = usePreferences();
  const update = useUpdatePreferences();
  const prefs = query.data;
  const [picker, setPicker] = useState<Picker>(null);

  function patch(next: Partial<UserPreferences>) {
    update.mutate(next);
  }

  const themeLabel = themeOptions.find((item) => item.id === prefs?.theme)?.label ?? 'Sistema';

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Preferências" titleStart onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {prefs ? (
          <>
            <Card padding={16} style={styles.card}>
              <AppText variant="label" color={colors.primary} style={styles.section}>
                Aparência
              </AppText>
              <View style={styles.row}>
                <View style={styles.copy}>
                  <AppText variant="body" color={colors.text}>
                    Tema
                  </AppText>
                  <AppText variant="caption" color={colors.muted}>
                    Escolha o tema do aplicativo
                  </AppText>
                </View>
                <Pressable
                  onPress={() => setPicker('theme')}
                  accessibilityRole="button"
                  accessibilityLabel="Tema"
                  style={[styles.themeChip, { backgroundColor: colors.chip }]}
                >
                  <AppText variant="body" color={colors.text}>
                    {themeLabel}
                  </AppText>
                  <Icon name="chevronDown" size={12} color={colors.muted} />
                </Pressable>
              </View>
            </Card>

            <Card padding={16} style={styles.card}>
              <AppText variant="label" color={colors.primary} style={styles.section}>
                Privacidade
              </AppText>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={[styles.iconWell, { backgroundColor: colors.primarySoft }]}>
                    <Icon name="eyeOff" size={18} color={colors.primaryInk} />
                  </View>
                  <View style={styles.copy}>
                    <AppText variant="bodySemi" color={colors.text}>
                      Ocultar valores
                    </AppText>
                    <AppText variant="caption" color={colors.muted}>
                      Ocultar saldos por padrão
                    </AppText>
                  </View>
                </View>
                <Toggle
                  value={prefs.hideBalances}
                  onChange={(hideBalances) => patch({ hideBalances })}
                  label="Ocultar valores"
                />
              </View>
            </Card>

            <Card padding={16} style={styles.card}>
              <AppText variant="label" color={colors.primary} style={styles.section}>
                Formatação
              </AppText>
              <PrefLink
                icon="exchange"
                title="Moeda principal"
                caption={currencyLabels[prefs.currency] ?? prefs.currency}
                onPress={() => setPicker('currency')}
              />
              <PrefLink
                icon="calendar"
                title="Período financeiro"
                caption={periodLabel(prefs.periodStartDay)}
                onPress={() => setPicker('period')}
                last
              />
            </Card>

            <Card padding={16} style={styles.card}>
              <AppText variant="label" color={colors.primary} style={styles.section}>
                Notificações
              </AppText>
              <View style={[styles.row, styles.notifyHead, { borderBottomColor: colors.chip }]}>
                <View style={styles.rowLeft}>
                  <View style={[styles.primaryWell, { backgroundColor: colors.primary }]}>
                    <Icon name="bell" size={18} color={colors.primarySoft} />
                  </View>
                  <View style={styles.copy}>
                    <AppText variant="bodySemi" color={colors.text}>
                      Permitir notificações
                    </AppText>
                    <AppText variant="caption" color={colors.muted}>
                      Gerenciar alertas no dispositivo
                    </AppText>
                  </View>
                </View>
                <Toggle
                  value={prefs.notificationsEnabled}
                  onChange={(notificationsEnabled) => patch({ notificationsEnabled })}
                  label="Permitir notificações"
                />
              </View>
              <View style={styles.subToggles}>
                <SubToggle
                  label="Contas a pagar"
                  value={prefs.notifyBills}
                  disabled={!prefs.notificationsEnabled}
                  onChange={(notifyBills) => patch({ notifyBills })}
                />
                <SubToggle
                  label="Faturas de cartão"
                  value={prefs.notifyInvoices}
                  disabled={!prefs.notificationsEnabled}
                  onChange={(notifyInvoices) => patch({ notifyInvoices })}
                />
                <SubToggle
                  label="Alertas de orçamento"
                  value={prefs.notifyBudgets}
                  disabled={!prefs.notificationsEnabled}
                  onChange={(notifyBudgets) => patch({ notifyBudgets })}
                />
                <SubToggle
                  label="Gastos atípicos"
                  value={prefs.notifyUnusual}
                  disabled={!prefs.notificationsEnabled}
                  onChange={(notifyUnusual) => patch({ notifyUnusual })}
                />
                <SubToggle
                  label="Progresso de metas"
                  value={prefs.notifyGoals}
                  disabled={!prefs.notificationsEnabled}
                  onChange={(notifyGoals) => patch({ notifyGoals })}
                />
                <SubToggle
                  label="Saldo baixo"
                  value={prefs.notifyLowBalance}
                  disabled={!prefs.notificationsEnabled}
                  onChange={(notifyLowBalance) => patch({ notifyLowBalance })}
                />
              </View>
            </Card>

            <Pressable
              onPress={() =>
                Alert.alert(
                  'Excluir conta',
                  'A exclusão de conta estará disponível em uma próxima etapa.',
                )
              }
              accessibilityRole="button"
              accessibilityLabel="Excluir conta"
              style={({ pressed }) => [
                styles.delete,
                { backgroundColor: colors.dangerSoft20 },
                pressed ? styles.pressed : null,
              ]}
            >
              <Icon name="trash" size={18} color={colors.danger} />
              <AppText variant="label" color={colors.danger}>
                Excluir Conta
              </AppText>
            </Pressable>
          </>
        ) : null}
      </ScrollView>

      <SelectSheet
        visible={picker === 'theme'}
        title="Tema"
        options={themeOptions}
        selectedId={prefs?.theme}
        onSelect={(id) => patch({ theme: id as ThemePreference })}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'currency'}
        title="Moeda principal"
        options={currencyOptions}
        selectedId={prefs?.currency}
        onSelect={(id) => patch({ currency: id })}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'period'}
        title="Período financeiro"
        options={periodOptions}
        selectedId={String(prefs?.periodStartDay === 15 ? 15 : 1)}
        onSelect={(id) => patch({ periodStartDay: Number(id) })}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

function PrefLink({
  icon,
  title,
  caption,
  onPress,
  last,
}: {
  icon: IconName;
  title: string;
  caption: string;
  onPress: () => void;
  last?: boolean;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.row,
        last ? null : styles.prefGap,
        pressed ? styles.pressed : null,
      ]}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconWell, { backgroundColor: colors.primarySoft }]}>
          <Icon name={icon} size={18} color={colors.primaryInk} />
        </View>
        <View style={styles.copy}>
          <AppText variant="bodySemi" color={colors.text}>
            {title}
          </AppText>
          <AppText variant="caption" color={colors.muted}>
            {caption}
          </AppText>
        </View>
      </View>
      <Icon name="chevronRight" size={18} color={colors.muted} />
    </Pressable>
  );
}

function SubToggle({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.row}>
      <AppText variant="body" color={colors.text} style={styles.copy}>
        {label}
      </AppText>
      <Toggle value={value} onChange={onChange} disabled={disabled} label={label} />
    </View>
  );
}

function Toggle({
  value,
  onChange,
  disabled,
  label,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={() => {
        if (!disabled) onChange(!value);
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: Boolean(disabled) }}
      accessibilityLabel={label}
      style={[
        styles.toggle,
        { backgroundColor: value ? colors.primary : colors.border },
        disabled ? styles.toggleDisabled : null,
      ]}
    >
      <View
        style={[styles.knob, { backgroundColor: colors.onPrimary }, value ? styles.knobOn : null]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 8, paddingTop: 8 },
  card: { borderRadius: radius.md, ...shadows.card },
  section: { textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  copy: { flex: 1 },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryWell: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeChip: {
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notifyHead: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  subToggles: { gap: 16, paddingLeft: 52 },
  prefGap: { marginBottom: 24 },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: radius.pill,
    padding: 2,
    justifyContent: 'center',
  },
  toggleDisabled: { opacity: 0.4 },
  knob: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
    ...shadows.card,
  },
  knobOn: { alignSelf: 'flex-end' },
  delete: {
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pressed: { opacity: 0.85 },
});
