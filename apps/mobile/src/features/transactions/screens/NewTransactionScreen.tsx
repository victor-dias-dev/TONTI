import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import {
  AppText,
  Card,
  FormField,
  PrimaryButton,
  SegmentedControl,
  SelectSheet,
  StackHeader,
} from '../../../components';
import { appendMoneyDigit, formatMoney, removeMoneyDigit } from '../../../domain';
import type { TransactionType } from '../../../domain';
import { useAccounts, useCategories, useCreateTransaction } from '../../../hooks/use-finance';
import { colors } from '../../../theme';
import { findAccount, findCategory } from '../../../utils/lookups';
import { newTransactionSchema, type NewTransactionValues } from '../schema';

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Despesa' },
  { value: 'income', label: 'Receita' },
  { value: 'transfer', label: 'Transferência' },
];

export function NewTransactionScreen() {
  const categories = useCategories();
  const accounts = useAccounts();
  const create = useCreateTransaction();
  const [picker, setPicker] = useState<'category' | 'account' | 'date' | null>(null);

  const form = useForm<NewTransactionValues>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: 'expense',
      amountCents: '0',
      description: '',
      categoryId: '',
      accountId: '',
      occurredAt: '2026-08-30',
      notes: '',
      repeat: false,
      installments: '1x',
    },
  });

  const amount = useWatch({ control: form.control, name: 'amountCents' });
  const type = useWatch({ control: form.control, name: 'type' });
  const categoryId = useWatch({ control: form.control, name: 'categoryId' });
  const accountId = useWatch({ control: form.control, name: 'accountId' });
  const occurredAt = useWatch({ control: form.control, name: 'occurredAt' });
  const repeat = useWatch({ control: form.control, name: 'repeat' });
  const installments = useWatch({ control: form.control, name: 'installments' });

  useEffect(() => {
    const currentCategory = form.getValues('categoryId');
    const currentAccount = form.getValues('accountId');
    const firstCategory = categories.data?.[0]?.id;
    const firstAccount = accounts.data?.[0]?.id;
    if (!currentCategory && firstCategory) {
      form.setValue('categoryId', firstCategory);
    }
    if (!currentAccount && firstAccount) {
      form.setValue('accountId', firstAccount);
    }
  }, [accounts.data, categories.data, form]);

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(
      {
        description: values.description,
        amountCents: values.amountCents,
        type: values.type,
        categoryId: values.categoryId,
        accountId: values.accountId,
        notes: values.notes,
        occurredAt: `${values.occurredAt}T12:00:00-03:00`,
      },
      { onSuccess: () => router.back() },
    );
  });

  const dateOptions = lastDays(7);

  return (
    <View style={styles.safe}>
      <StackHeader title="Nova Transação" onBack={() => router.back()} close />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.amount}>
          <AppText variant="caption" color={colors.muted} align="center">
            Valor
          </AppText>
          <Pressable
            onPress={() => undefined}
            accessibilityLabel="Valor da transação"
            style={styles.amountPad}
          >
            <AppText variant="display" color={colors.primary} align="center">
              {formatMoney(amount ?? '0', { sign: 'never' })}
            </AppText>
          </Pressable>
          <View style={styles.digits}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'].map((key) => (
              <Pressable
                key={key}
                onPress={() => {
                  if (key === '⌫') {
                    form.setValue('amountCents', removeMoneyDigit(amount ?? '0'), {
                      shouldValidate: true,
                    });
                    return;
                  }
                  const next =
                    key === '00'
                      ? appendMoneyDigit(appendMoneyDigit(amount ?? '0', '0'), '0')
                      : appendMoneyDigit(amount ?? '0', key);
                  form.setValue('amountCents', next, { shouldValidate: true });
                }}
                accessibilityRole="button"
                accessibilityLabel={key === '⌫' ? 'Apagar' : key}
                style={styles.digit}
              >
                <AppText variant="titleSm" color={colors.primary}>
                  {key}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>

        <SegmentedControl
          options={typeOptions}
          value={type}
          onChange={(value) => form.setValue('type', value)}
        />

        <Card padding={16}>
          <Controller
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormField
                icon="edit"
                label="Descrição"
                value={field.value}
                editable
                onChangeText={field.onChange}
              />
            )}
          />
          <FormField
            icon="grid"
            label="Categoria"
            value={findCategory(categories.data, categoryId)?.name}
            onPress={() => setPicker('category')}
          />
          <FormField
            icon="bank"
            label="Conta"
            value={findAccount(accounts.data, accountId)?.name}
            onPress={() => setPicker('account')}
          />
          <FormField
            icon="calendar"
            label="Data"
            value={formatDate(occurredAt)}
            onPress={() => setPicker('date')}
          />
          <View style={styles.toggle}>
            <FormField icon="repeat" label="Repetir" last />
            <Switch
              value={repeat}
              onValueChange={(value) => form.setValue('repeat', value)}
              trackColor={{ false: colors.track, true: colors.primarySoft }}
              thumbColor={repeat ? colors.primary : colors.surface}
              accessibilityLabel="Repetir transação"
            />
          </View>
          <FormField icon="installments" label="Parcelas" value={installments} last />
          <Controller
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormField
                icon="edit"
                label="Observações"
                value={field.value}
                editable
                last
                onChangeText={field.onChange}
              />
            )}
          />
        </Card>

        {form.formState.errors.amountCents || form.formState.errors.description ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.amountCents?.message ??
              form.formState.errors.description?.message}
          </AppText>
        ) : null}

        <PrimaryButton label="Adicionar transação" onPress={onSubmit} loading={create.isPending} />
      </ScrollView>

      <SelectSheet
        visible={picker === 'category'}
        title="Categoria"
        options={(categories.data ?? []).map((item) => ({ id: item.id, label: item.name }))}
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
        visible={picker === 'date'}
        title="Data"
        options={dateOptions}
        selectedId={occurredAt}
        onSelect={(id) => form.setValue('occurredAt', id)}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

function lastDays(count: number) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(2026, 7, 30);
    date.setDate(date.getDate() - index);
    const id = date.toISOString().slice(0, 10);
    return { id, label: formatDate(id) };
  });
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  amount: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  amountPad: { paddingVertical: 8 },
  digits: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'center' },
  digit: {
    width: '30%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: { flexDirection: 'row', alignItems: 'center' },
});
