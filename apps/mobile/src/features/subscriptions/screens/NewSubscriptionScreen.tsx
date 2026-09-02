import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  AmountKeypad,
  AppText,
  Card,
  FormField,
  PrimaryButton,
  SelectSheet,
  StackHeader,
} from '../../../components';
import { useAccounts, useCategories } from '../../../hooks/use-finance';
import { useCreateSubscription } from '../../../hooks/use-subscriptions';
import { useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { findAccount, findCategory } from '../../../utils/lookups';
import { newSubscriptionSchema, type NewSubscriptionValues } from '../schema';

const frequencyOptions = [
  { id: 'weekly', label: 'Semanal' },
  { id: 'monthly', label: 'Mensal' },
  { id: 'quarterly', label: 'Trimestral' },
  { id: 'yearly', label: 'Anual' },
] as const;

type Picker = 'category' | 'account' | 'frequency' | 'date' | null;

export function NewSubscriptionScreen() {
  const colors = useColors();
  const categories = useCategories();
  const accounts = useAccounts();
  const create = useCreateSubscription();
  const [picker, setPicker] = useState<Picker>(null);
  const today = todayIso();

  const expenseCategories = useMemo(
    () => (categories.data ?? []).filter((item) => item.type === 'expense'),
    [categories.data],
  );

  const form = useForm<NewSubscriptionValues>({
    resolver: zodResolver(newSubscriptionSchema),
    defaultValues: {
      name: '',
      amountCents: '0',
      accountId: '',
      categoryId: '',
      frequency: 'monthly',
      nextChargeDate: today,
    },
  });

  const amountCents = useWatch({ control: form.control, name: 'amountCents' }) ?? '0';
  const accountId = useWatch({ control: form.control, name: 'accountId' }) ?? '';
  const categoryId = useWatch({ control: form.control, name: 'categoryId' }) ?? '';
  const frequency = useWatch({ control: form.control, name: 'frequency' }) ?? 'monthly';
  const nextChargeDate = useWatch({ control: form.control, name: 'nextChargeDate' }) ?? today;

  useEffect(() => {
    const currentCategory = form.getValues('categoryId');
    const currentAccount = form.getValues('accountId');
    const preferred =
      expenseCategories.find((item) => item.name.toLowerCase() === 'assinatura') ??
      expenseCategories[0];
    if (!currentCategory && preferred?.id) {
      form.setValue('categoryId', preferred.id);
    }
    if (!currentAccount && accounts.data?.[0]?.id) {
      form.setValue('accountId', accounts.data[0].id);
    }
  }, [accounts.data, expenseCategories, form]);

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(
      {
        name: values.name,
        amountCents: values.amountCents,
        accountId: values.accountId,
        categoryId: values.categoryId,
        frequency: values.frequency,
        nextChargeDate: values.nextChargeDate,
      },
      { onSuccess: () => router.back() },
    );
  });

  const formError =
    form.formState.errors.amountCents?.message ??
    form.formState.errors.name?.message ??
    form.formState.errors.categoryId?.message ??
    form.formState.errors.accountId?.message ??
    form.formState.errors.nextChargeDate?.message;

  const frequencyLabel = frequencyOptions.find((item) => item.id === frequency)?.label ?? 'Mensal';

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Nova assinatura" onBack={() => router.back()} close />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AmountKeypad
          value={amountCents ?? '0'}
          onChange={(cents) => form.setValue('amountCents', cents, { shouldValidate: true })}
        />
        <Card padding={16}>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormField
                icon="subscription"
                label="Nome"
                value={field.value}
                editable
                onChangeText={field.onChange}
                placeholder="Netflix, Spotify..."
                autoCapitalize="sentences"
              />
            )}
          />
          <FormField
            icon="grid"
            label="Categoria"
            value={findCategory(expenseCategories, categoryId)?.name}
            onPress={() => setPicker('category')}
          />
          <FormField
            icon="bank"
            label="Conta"
            value={findAccount(accounts.data, accountId)?.name}
            onPress={() => setPicker('account')}
          />
          <FormField
            icon="repeat"
            label="Frequência"
            value={frequencyLabel}
            onPress={() => setPicker('frequency')}
          />
          <FormField
            icon="calendar"
            label="Próxima cobrança"
            value={formatDate(nextChargeDate)}
            onPress={() => setPicker('date')}
            last
          />
        </Card>
        {expenseCategories.length === 0 ? (
          <AppText variant="caption" color={colors.muted}>
            Cadastre uma categoria de despesa para criar a assinatura.
          </AppText>
        ) : null}
        {formError || create.error ? (
          <AppText variant="caption" color={colors.danger}>
            {formError ?? getErrorMessage(create.error)}
          </AppText>
        ) : null}
        <PrimaryButton
          label="Salvar assinatura"
          onPress={onSubmit}
          loading={create.isPending}
          disabled={create.isPending || expenseCategories.length === 0}
        />
      </ScrollView>
      <SelectSheet
        visible={picker === 'category'}
        title="Categoria"
        options={expenseCategories.map((item) => ({ id: item.id, label: item.name }))}
        selectedId={categoryId}
        onSelect={(id) => form.setValue('categoryId', id)}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'account'}
        title="Conta"
        options={(accounts.data ?? []).map((item) => ({ id: item.id, label: item.name }))}
        selectedId={accountId}
        onSelect={(id) => form.setValue('accountId', id)}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'frequency'}
        title="Frequência"
        options={frequencyOptions.map((item) => ({ id: item.id, label: item.label }))}
        selectedId={frequency}
        onSelect={(id) => form.setValue('frequency', id as NewSubscriptionValues['frequency'])}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'date'}
        title="Próxima cobrança"
        options={upcomingDays(14)}
        selectedId={nextChargeDate}
        onSelect={(id) => form.setValue('nextChargeDate', id)}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

function todayIso() {
  const now = new Date();
  return toIsoDate(now);
}

function upcomingDays(count: number) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    const id = toIsoDate(date);
    return { id, label: formatDate(id) };
  });
}

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
});
