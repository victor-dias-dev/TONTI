import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
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
import { useCreateCard } from '../../../hooks/use-finance';
import { useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { newCardSchema, type NewCardValues } from '../schema';

const brandOptions = [
  { id: 'Visa', label: 'Visa' },
  { id: 'Mastercard', label: 'Mastercard' },
  { id: 'Elo', label: 'Elo' },
  { id: 'American Express', label: 'American Express' },
  { id: 'Hipercard', label: 'Hipercard' },
];

const dayOptions = Array.from({ length: 31 }, (_, index) => {
  const day = String(index + 1);
  return { id: day, label: `Dia ${day}` };
});

type Picker = 'brand' | 'closing' | 'due' | null;

export function NewCardScreen() {
  const colors = useColors();
  const create = useCreateCard();
  const [picker, setPicker] = useState<Picker>(null);

  const form = useForm<NewCardValues>({
    resolver: zodResolver(newCardSchema),
    defaultValues: {
      name: '',
      brand: 'Visa',
      lastDigits: '',
      limitCents: '0',
      closingDay: '1',
      dueDay: '10',
    },
  });

  const limitCents = useWatch({ control: form.control, name: 'limitCents' }) ?? '0';
  const brand = useWatch({ control: form.control, name: 'brand' }) ?? 'Visa';
  const closingDay = useWatch({ control: form.control, name: 'closingDay' }) ?? '1';
  const dueDay = useWatch({ control: form.control, name: 'dueDay' }) ?? '10';

  const brandLabel = useMemo(
    () => brandOptions.find((item) => item.id === brand)?.label ?? brand,
    [brand],
  );

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(
      {
        name: values.name,
        brand: values.brand,
        lastDigits: values.lastDigits,
        limitCents: values.limitCents,
        closingDay: Number(values.closingDay),
        dueDay: Number(values.dueDay),
      },
      { onSuccess: () => router.back() },
    );
  });

  const formError =
    form.formState.errors.limitCents?.message ??
    form.formState.errors.name?.message ??
    form.formState.errors.brand?.message ??
    form.formState.errors.lastDigits?.message ??
    form.formState.errors.closingDay?.message ??
    form.formState.errors.dueDay?.message;

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Novo cartão" onBack={() => router.back()} close />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AmountKeypad
          value={limitCents}
          onChange={(cents) => form.setValue('limitCents', cents, { shouldValidate: true })}
          label="Limite"
        />
        <Card padding={16}>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormField
                icon="card"
                label="Nome"
                value={field.value}
                editable
                onChangeText={field.onChange}
                placeholder="Nubank, Itaú..."
                autoCapitalize="sentences"
              />
            )}
          />
          <FormField
            icon="card"
            label="Bandeira"
            value={brandLabel}
            onPress={() => setPicker('brand')}
          />
          <Controller
            control={form.control}
            name="lastDigits"
            render={({ field }) => (
              <FormField
                icon="card"
                label="Final"
                value={field.value}
                editable
                onChangeText={(text) => field.onChange(text.replace(/\D/g, '').slice(0, 4))}
                placeholder="Últimos 4 dígitos"
                keyboardType="number-pad"
              />
            )}
          />
          <FormField
            icon="calendar"
            label="Fechamento"
            value={`Dia ${closingDay}`}
            onPress={() => setPicker('closing')}
          />
          <FormField
            icon="calendar"
            label="Vencimento"
            value={`Dia ${dueDay}`}
            onPress={() => setPicker('due')}
            last
          />
        </Card>
        {formError || create.error ? (
          <AppText variant="caption" color={colors.danger}>
            {formError ?? getErrorMessage(create.error)}
          </AppText>
        ) : null}
        <PrimaryButton
          label="Salvar cartão"
          onPress={onSubmit}
          loading={create.isPending}
          disabled={create.isPending}
        />
      </ScrollView>
      <SelectSheet
        visible={picker === 'brand'}
        title="Bandeira"
        options={brandOptions}
        selectedId={brand}
        onSelect={(id) => form.setValue('brand', id)}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'closing'}
        title="Dia de fechamento"
        options={dayOptions}
        selectedId={closingDay}
        onSelect={(id) => form.setValue('closingDay', id)}
        onClose={() => setPicker(null)}
      />
      <SelectSheet
        visible={picker === 'due'}
        title="Dia de vencimento"
        options={dayOptions}
        selectedId={dueDay}
        onSelect={(id) => form.setValue('dueDay', id)}
        onClose={() => setPicker(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
});
