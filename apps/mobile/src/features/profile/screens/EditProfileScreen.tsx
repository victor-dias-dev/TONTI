import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, FormField, PrimaryButton, StackHeader } from '../../../components';
import { useProfile, useUpdateProfile } from '../../../hooks/use-finance';
import { useSession } from '../../../hooks/use-session';
import { radius, useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { editProfileSchema, type EditProfileValues } from '../schema';

export function EditProfileScreen() {
  const colors = useColors();
  const profile = useProfile();
  const { user } = useSession();
  const update = useUpdateProfile();
  const form = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile.data?.name ?? user?.name ?? '',
      email: profile.data?.email ?? user?.email ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      name: profile.data?.name ?? user?.name ?? '',
      email: profile.data?.email ?? user?.email ?? '',
    });
  }, [form, profile.data?.email, profile.data?.name, user?.email, user?.name]);

  const onSubmit = form.handleSubmit((values) => {
    update.mutate(
      { name: values.name, email: values.email },
      {
        onSuccess: () => router.back(),
      },
    );
  });

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Editar perfil" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card padding={20} style={styles.card}>
          <Controller
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormField
                icon="user"
                label="Nome"
                value={field.value}
                onChangeText={field.onChange}
                editable
                autoCapitalize="words"
                placeholder="Seu nome"
              />
            )}
          />
          <Controller
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormField
                icon="user"
                label="E-mail"
                value={field.value}
                onChangeText={field.onChange}
                editable
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Seu e-mail"
                last
              />
            )}
          />
        </Card>
        {form.formState.errors.name ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.name.message}
          </AppText>
        ) : null}
        {form.formState.errors.email ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.email.message}
          </AppText>
        ) : null}
        {update.error ? (
          <AppText variant="caption" color={colors.danger}>
            {getErrorMessage(update.error)}
          </AppText>
        ) : null}
        <PrimaryButton
          label="Salvar"
          onPress={onSubmit}
          loading={update.isPending}
          disabled={update.isPending}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  card: { borderRadius: radius.lg },
});
