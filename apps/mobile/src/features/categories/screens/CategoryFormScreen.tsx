import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  AppText,
  Card,
  FormField,
  Icon,
  PrimaryButton,
  SelectSheet,
  StackHeader,
} from '../../../components';
import type { CategoryKind, IconName } from '../../../domain';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../../../hooks/use-finance';
import { radius, useColors } from '../../../theme';
import { asIconName } from '../../../utils/lookups';
import { getErrorMessage } from '../../../utils/error-message';
import { categoryFormSchema, type CategoryFormValues } from '../schema';

const CATEGORY_ICONS: { id: IconName; label: string; iconBg: string }[] = [
  { id: 'food', label: 'Alimentação', iconBg: 'rgba(187, 232, 228, 0.3)' },
  { id: 'transport', label: 'Transporte', iconBg: 'rgba(255, 243, 224, 0.5)' },
  { id: 'market', label: 'Mercado', iconBg: 'rgba(232, 245, 233, 0.5)' },
  { id: 'homeCategory', label: 'Moradia', iconBg: 'rgba(227, 242, 253, 0.5)' },
  { id: 'leisure', label: 'Lazer', iconBg: 'rgba(243, 229, 245, 0.5)' },
  { id: 'subscription', label: 'Assinatura', iconBg: 'rgba(187, 232, 228, 0.3)' },
  { id: 'income', label: 'Receita', iconBg: 'rgba(0, 77, 64, 0.2)' },
  { id: 'wallet', label: 'Carteira', iconBg: 'rgba(187, 232, 228, 0.3)' },
  { id: 'card', label: 'Cartão', iconBg: 'rgba(227, 242, 253, 0.5)' },
  { id: 'savings', label: 'Poupança', iconBg: 'rgba(0, 77, 64, 0.2)' },
  { id: 'grid', label: 'Geral', iconBg: 'rgba(236, 238, 238, 1)' },
];

interface CategoryFormScreenProps {
  categoryId?: string;
  type?: CategoryKind;
}

export function CategoryFormScreen({ categoryId, type = 'expense' }: CategoryFormScreenProps) {
  const colors = useColors();
  const categories = useCategories();
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();
  const [picker, setPicker] = useState(false);
  const current = categories.data?.find((item) => item.id === categoryId);
  const isEdit = Boolean(categoryId);
  const kind = current?.type ?? type;
  const defaultIcon = kind === 'income' ? 'income' : 'grid';
  const defaultMeta =
    CATEGORY_ICONS.find((item) => item.id === (current?.icon ?? defaultIcon)) ?? CATEGORY_ICONS[0];

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      icon: defaultMeta.id,
      iconBg: defaultMeta.iconBg,
    },
  });

  useEffect(() => {
    if (!current) return;
    form.reset({
      name: current.name,
      icon: current.icon,
      iconBg: current.iconBg,
    });
  }, [current, form]);

  const selectedIcon = form.watch('icon');
  const iconLabel = useMemo(
    () => CATEGORY_ICONS.find((item) => item.id === selectedIcon)?.label ?? 'Ícone',
    [selectedIcon],
  );

  const pending = create.isPending || update.isPending || remove.isPending;
  const error = create.error ?? update.error ?? remove.error;

  const onSubmit = form.handleSubmit((values) => {
    const icon = asIconName(values.icon);
    if (isEdit && categoryId) {
      update.mutate(
        { id: categoryId, payload: { name: values.name, icon, iconBg: values.iconBg } },
        { onSuccess: () => router.back() },
      );
      return;
    }
    create.mutate(
      { name: values.name, icon, iconBg: values.iconBg, type: kind },
      { onSuccess: () => router.back() },
    );
  });

  function confirmDelete() {
    if (!categoryId || current?.isSystem) return;
    Alert.alert('Excluir categoria', 'Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () =>
          remove.mutate(categoryId, {
            onSuccess: () => router.back(),
          }),
      },
    ]);
  }

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader
        title={isEdit ? 'Editar categoria' : 'Nova categoria'}
        onBack={() => router.back()}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card padding={20} style={styles.card}>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormField
                icon="grid"
                label="Nome"
                value={field.value}
                onChangeText={field.onChange}
                editable
                autoCapitalize="sentences"
                placeholder="Nome da categoria"
              />
            )}
          />
          <FormField
            icon={asIconName(selectedIcon)}
            label="Ícone"
            value={iconLabel}
            onPress={() => setPicker(true)}
            last
          />
        </Card>
        {form.formState.errors.name ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.name.message}
          </AppText>
        ) : null}
        {error ? (
          <AppText variant="caption" color={colors.danger}>
            {getErrorMessage(error)}
          </AppText>
        ) : null}
        <PrimaryButton
          label={isEdit ? 'Salvar' : 'Criar categoria'}
          onPress={onSubmit}
          loading={create.isPending || update.isPending}
          disabled={pending}
        />
        {isEdit && current && !current.isSystem ? (
          <Pressable
            onPress={confirmDelete}
            accessibilityRole="button"
            accessibilityLabel="Excluir categoria"
            style={({ pressed }) => [
              styles.delete,
              { backgroundColor: colors.dangerSoft20 },
              pressed ? styles.pressed : null,
            ]}
          >
            <Icon name="trash" size={18} color={colors.danger} />
            <AppText variant="label" color={colors.danger}>
              Excluir categoria
            </AppText>
          </Pressable>
        ) : null}
      </ScrollView>
      <SelectSheet
        visible={picker}
        title="Ícone"
        options={CATEGORY_ICONS.map((item) => ({ id: item.id, label: item.label }))}
        selectedId={selectedIcon}
        onSelect={(id) => {
          const next = CATEGORY_ICONS.find((item) => item.id === id) ?? defaultMeta;
          form.setValue('icon', next.id);
          form.setValue('iconBg', next.iconBg);
        }}
        onClose={() => setPicker(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  card: { borderRadius: radius.lg },
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
