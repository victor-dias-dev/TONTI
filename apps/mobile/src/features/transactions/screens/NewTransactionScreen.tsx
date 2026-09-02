import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import {
  AppText,
  Card,
  FormField,
  Icon,
  PrimaryButton,
  SegmentedControl,
  SelectSheet,
  StackHeader,
} from '../../../components';
import { appendMoneyDigit, formatMoney, removeMoneyDigit } from '../../../domain';
import type { TransactionType } from '../../../domain';
import {
  useAccounts,
  useCards,
  useCategories,
  useCreateTransaction,
  useDeleteTransaction,
  useTransaction,
  useUpdateTransaction,
} from '../../../hooks/use-finance';
import { radius, useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { findCategory } from '../../../utils/lookups';
import { newTransactionSchema, type NewTransactionValues } from '../schema';

const typeOptions: { value: TransactionType; label: string }[] = [
  { value: 'expense', label: 'Despesa' },
  { value: 'income', label: 'Receita' },
  { value: 'transfer', label: 'Transferência' },
];

const installmentOptions = Array.from({ length: 24 }, (_, index) => {
  const count = index + 1;
  return { id: `${count}x`, label: count === 1 ? 'À vista' : `${count}x` };
});

interface NewTransactionScreenProps {
  transactionId?: string;
}

export function NewTransactionScreen({ transactionId }: NewTransactionScreenProps) {
  const colors = useColors();
  const isEdit = Boolean(transactionId);
  const categories = useCategories();
  const accounts = useAccounts();
  const cards = useCards();
  const transactionQuery = useTransaction(transactionId ?? '');
  const create = useCreateTransaction();
  const update = useUpdateTransaction();
  const remove = useDeleteTransaction();
  const [picker, setPicker] = useState<'category' | 'account' | 'date' | 'installments' | null>(
    null,
  );
  const today = todayIso();
  const current = transactionQuery.data;

  const form = useForm<NewTransactionValues>({
    resolver: zodResolver(newTransactionSchema),
    defaultValues: {
      type: 'expense',
      amountCents: '0',
      description: '',
      categoryId: '',
      accountId: '',
      occurredAt: today,
      notes: '',
      repeat: false,
      installments: '1x',
    },
  });

  const amount = useWatch({ control: form.control, name: 'amountCents' }) ?? '0';
  const type = useWatch({ control: form.control, name: 'type' }) ?? 'expense';
  const categoryId = useWatch({ control: form.control, name: 'categoryId' }) ?? '';
  const accountId = useWatch({ control: form.control, name: 'accountId' }) ?? '';
  const occurredAt = useWatch({ control: form.control, name: 'occurredAt' }) ?? today;
  const repeat = useWatch({ control: form.control, name: 'repeat' });
  const installments = useWatch({ control: form.control, name: 'installments' });

  const matchingCategories = useMemo(() => {
    const items = categories.data ?? [];
    if (type === 'transfer') return items;
    return items.filter((item) => item.type === type);
  }, [categories.data, type]);

  const paymentSources = useMemo(() => {
    const banks = (accounts.data ?? []).map((item) => ({ id: item.id, name: item.name }));
    const credit = (cards.data ?? []).map((item) => ({
      id: item.accountId,
      name: `${item.name} •••• ${item.lastDigits}`,
    }));
    return [...banks, ...credit];
  }, [accounts.data, cards.data]);

  const isCreditCard = Boolean(cards.data?.some((item) => item.accountId === accountId));

  useEffect(() => {
    if (!current) return;
    form.reset({
      type: current.type,
      amountCents: current.amountCents,
      description: current.description,
      categoryId: current.categoryId,
      accountId: current.accountId,
      occurredAt: datePart(current.occurredAt),
      notes: current.notes ?? '',
      repeat: false,
      installments: '1x',
    });
  }, [current, form]);

  const previousType = useRef(type);

  useEffect(() => {
    if (matchingCategories.length === 0) return;
    const typeChanged = previousType.current !== type;
    previousType.current = type;
    const currentCategory = form.getValues('categoryId');
    const currentAccount = form.getValues('accountId');
    const inList = matchingCategories.some((item) => item.id === currentCategory);

    if (!inList && (typeChanged || !currentCategory)) {
      form.setValue('categoryId', matchingCategories[0]?.id ?? '');
    }
    if (!currentAccount && paymentSources[0]?.id) {
      form.setValue('accountId', paymentSources[0].id);
    }
  }, [form, matchingCategories, paymentSources, type]);

  const pending = create.isPending || update.isPending || remove.isPending;

  const onSubmit = form.handleSubmit((values) => {
    const installmentCount = Number.parseInt(values.installments ?? '1', 10) || 1;
    const payingWithCard = cards.data?.some((item) => item.accountId === values.accountId);
    if (installmentCount > 1 && !payingWithCard) {
      form.setError('installments', {
        message: 'Para parcelar, selecione um cartão de crédito.',
      });
      return;
    }
    const input = {
      description: values.description,
      amountCents: values.amountCents,
      type: values.type,
      categoryId: values.categoryId,
      accountId: values.accountId,
      notes: values.notes,
      occurredAt: `${values.occurredAt}T12:00:00-03:00`,
      ...(installmentCount > 1 ? { installmentCount } : {}),
    };
    if (isEdit && transactionId) {
      update.mutate({ id: transactionId, input }, { onSuccess: () => router.back() });
      return;
    }
    create.mutate(input, { onSuccess: () => router.back() });
  });

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

  const dateOptions = lastDays(isEdit ? 30 : 7, occurredAt);
  const mutationError = create.error ?? update.error ?? remove.error;
  const formError =
    form.formState.errors.amountCents?.message ??
    form.formState.errors.description?.message ??
    form.formState.errors.categoryId?.message ??
    form.formState.errors.accountId?.message ??
    form.formState.errors.occurredAt?.message ??
    form.formState.errors.installments?.message;

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader
        title={isEdit ? 'Editar transação' : 'Nova Transação'}
        onBack={() => router.back()}
        close={!isEdit}
      />
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
              {formatMoney(amount, { sign: 'never' })}
            </AppText>
          </Pressable>
          <View style={styles.digits}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'].map((key) => (
              <Pressable
                key={key}
                onPress={() => {
                  if (key === '⌫') {
                    form.setValue('amountCents', removeMoneyDigit(amount), {
                      shouldValidate: true,
                    });
                    return;
                  }
                  const next =
                    key === '00'
                      ? appendMoneyDigit(appendMoneyDigit(amount, '0'), '0')
                      : appendMoneyDigit(amount, key);
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
            value={findCategory(matchingCategories, categoryId)?.name}
            onPress={() => setPicker('category')}
          />
          <FormField
            icon="bank"
            label="Conta"
            value={paymentSources.find((item) => item.id === accountId)?.name}
            onPress={() => setPicker('account')}
          />
          <FormField
            icon="calendar"
            label="Data"
            value={formatDate(occurredAt)}
            onPress={() => setPicker('date')}
            last={isEdit}
          />
          {isEdit ? null : (
            <>
              <FormField
                icon="repeat"
                label="Repetir"
                trailing={
                  <Switch
                    value={Boolean(repeat)}
                    onValueChange={(value) => form.setValue('repeat', value)}
                    trackColor={{ false: colors.track, true: colors.primarySoft }}
                    thumbColor={repeat ? colors.primary : colors.surface}
                    accessibilityLabel="Repetir transação"
                  />
                }
              />
              <FormField
                icon="installments"
                label="Parcelas"
                value={installments ?? '1x'}
                onPress={() => setPicker('installments')}
              />
            </>
          )}
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

        {isEdit && transactionQuery.isError ? (
          <AppText variant="caption" color={colors.danger}>
            Transação não encontrada.
          </AppText>
        ) : null}

        {!isEdit && !isCreditCard && installments && installments !== '1x' ? (
          <AppText variant="caption" color={colors.muted}>
            Para parcelar, selecione um cartão de crédito.
          </AppText>
        ) : null}

        {formError || mutationError ? (
          <AppText variant="caption" color={colors.danger}>
            {formError ?? getErrorMessage(mutationError)}
          </AppText>
        ) : null}

        <PrimaryButton
          label={isEdit ? 'Salvar alterações' : 'Adicionar transação'}
          onPress={onSubmit}
          loading={create.isPending || update.isPending}
          disabled={pending || (isEdit && !current)}
        />

        {isEdit ? (
          <Pressable
            onPress={confirmDelete}
            disabled={pending}
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
        ) : null}
      </ScrollView>

      <SelectSheet
        visible={picker === 'category'}
        title="Categoria"
        options={matchingCategories.map((item) => ({ id: item.id, label: item.name }))}
        selectedId={categoryId}
        onSelect={(id) => form.setValue('categoryId', id)}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'account'}
        title="Conta"
        options={paymentSources.map((item) => ({ id: item.id, label: item.name }))}
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
      <SelectSheet
        visible={picker === 'installments'}
        title="Parcelas"
        options={installmentOptions}
        selectedId={installments ?? '1x'}
        onSelect={(id) => form.setValue('installments', id)}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

function todayIso() {
  return toIsoDate(new Date());
}

function datePart(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso.slice(0, 10);
  }
  return toIsoDate(date);
}

function lastDays(count: number, extra?: string) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const options = Array.from({ length: count }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const id = toIsoDate(date);
    return { id, label: formatDate(id) };
  });
  if (extra && extra.length >= 10 && !options.some((item) => item.id === extra)) {
    options.push({ id: extra, label: formatDate(extra) });
  }
  return options;
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
  amount: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  amountPad: { paddingVertical: 8 },
  digits: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'center' },
  digit: {
    width: '30%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
