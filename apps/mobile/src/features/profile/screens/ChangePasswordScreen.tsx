import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AppText, Card, FormField, PrimaryButton, StackHeader } from '../../../components';
import { useChangePassword } from '../../../hooks/use-finance';
import { radius, useColors } from '../../../theme';
import { getErrorMessage } from '../../../utils/error-message';
import { changePasswordSchema, type ChangePasswordValues } from '../schema';

export function ChangePasswordScreen() {
  const colors = useColors();
  const changePassword = useChangePassword();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    changePassword.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      { onSuccess: () => router.back() },
    );
  });

  return (
    <View style={[styles.safe, { backgroundColor: colors.background }]}>
      <StackHeader title="Alterar senha" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card padding={20} style={styles.card}>
          <Controller
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormField
                icon="lock"
                label="Senha atual"
                value={field.value}
                onChangeText={field.onChange}
                editable
                secureTextEntry
                autoCapitalize="none"
                placeholder="Senha atual"
              />
            )}
          />
          <Controller
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormField
                icon="lock"
                label="Nova senha"
                value={field.value}
                onChangeText={field.onChange}
                editable
                secureTextEntry
                autoCapitalize="none"
                placeholder="Nova senha"
              />
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormField
                icon="lock"
                label="Confirmar senha"
                value={field.value}
                onChangeText={field.onChange}
                editable
                secureTextEntry
                autoCapitalize="none"
                placeholder="Confirmar senha"
                last
              />
            )}
          />
        </Card>
        {form.formState.errors.currentPassword ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.currentPassword.message}
          </AppText>
        ) : null}
        {form.formState.errors.newPassword ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.newPassword.message}
          </AppText>
        ) : null}
        {form.formState.errors.confirmPassword ? (
          <AppText variant="caption" color={colors.danger}>
            {form.formState.errors.confirmPassword.message}
          </AppText>
        ) : null}
        {changePassword.error ? (
          <AppText variant="caption" color={colors.danger}>
            {getErrorMessage(changePassword.error)}
          </AppText>
        ) : null}
        <PrimaryButton
          label="Redefinir senha"
          onPress={onSubmit}
          loading={changePassword.isPending}
          disabled={changePassword.isPending}
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
