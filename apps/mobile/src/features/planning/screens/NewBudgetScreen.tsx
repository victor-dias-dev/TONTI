import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { useCategories, useCreateBudget, usePlanning } from '../../../hooks/use-finance';
import { useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { findCategory } from '../../../utils/lookups';
import { newBudgetSchema, type NewBudgetValues } from '../schema';

export function NewBudgetScreen() {
  const colors = useColors();
  const categories = useCategories();
  const planning = usePlanning();
  const create = useCreateBudget();
  const [picker, setPicker] = useState(false);

  const used = useMemo(
    () => new Set((planning.data?.budgets ?? []).map((item) => item.categoryId)),
    [planning.data?.budgets],
  );
  const options = useMemo(
    () => (categories.data ?? []).filter((item) => item.type === 'expense' && !used.has(item.id)),
    [categories.data, used],
  );

  const form = useForm<NewBudgetValues>({
    resolver: zodResolver(newBudgetSchema),
    defaultValues: {
      categoryId: '',
      amountCents: '0',
    },
  });

  const categoryId = useWatch({ control: form.control, name: 'categoryId' }) ?? '';
  const amountCents = useWatch({ control: form.control, name: 'amountCents' }) ?? '0';

  useEffect(() => {
    const current = form.getValues('categoryId');
    if (!options.some((item) => item.id === current)) {
      form.setValue('categoryId', options[0]?.id ?? '');
    }
  }, [form, options]);

  const onSubmit = form.handleSubmit((values) => {
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    create.mutate(
      { categoryId: values.categoryId, month, amountCents: values.amountCents },
      { onSuccess: () => router.back() },
    );
  });

  const formError =
    form.formState.errors.amountCents?.message ?? form.formState.errors.categoryId?.message;

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Novo planejamento" onBack={() => router.back()} close />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AmountKeypad
          value={amountCents ?? '0'}
          onChange={(cents) => form.setValue('amountCents', cents, { shouldValidate: true })}
          label="Valor planejado"
        />
        <Card padding={16}>
          <FormField
            icon="grid"
            label="Categoria"
            value={
              findCategory(options, categoryId)?.name ??
              findCategory(categories.data, categoryId)?.name
            }
            onPress={() => setPicker(true)}
            last
          />
        </Card>
        {options.length === 0 ? (
          <AppText variant="caption" color={colors.muted}>
            Todas as categorias de despesa já têm orçamento neste mês.
          </AppText>
        ) : null}
        {formError || create.error ? (
          <AppText variant="caption" color={colors.danger}>
            {formError ?? getErrorMessage(create.error)}
          </AppText>
        ) : null}
        <PrimaryButton
          label="Salvar planejamento"
          onPress={onSubmit}
          loading={create.isPending}
          disabled={create.isPending || options.length === 0}
        />
      </ScrollView>
      <SelectSheet
        visible={picker}
        title="Categoria"
        options={options.map((item) => ({ id: item.id, label: item.name }))}
        selectedId={categoryId}
        onSelect={(id) => form.setValue('categoryId', id)}
        onClose={() => setPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
});
