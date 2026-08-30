import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { strings } from '../src/constants/strings';
import { colors } from '../src/constants/theme';
import { useRegister } from '../src/hooks/use-register';
import { useSession } from '../src/hooks/use-session';
import { RegisterFormValues, registerSchema } from '../src/schemas/auth';
import { getErrorMessage } from '../src/utils/error-message';

export default function RegisterScreen() {
  const { isAuthenticated } = useSession();
  const register = useRegister();
  const { control, handleSubmit } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const onSubmit = handleSubmit((values) => {
    register.mutate(values, {
      onSuccess: () => {
        router.replace('/login');
      },
    });
  });

  return (
    <Screen>
      <Text style={styles.brand}>{strings.appName}</Text>
      <Text style={styles.title}>{strings.register.title}</Text>
      <Text style={styles.subtitle}>{strings.register.subtitle}</Text>

      <TextField control={control} name="name" label={strings.fields.name} autoCapitalize="words" />
      <TextField
        control={control}
        name="email"
        label={strings.fields.email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextField
        control={control}
        name="password"
        label={strings.fields.password}
        secureTextEntry
      />

      {register.error ? <Text style={styles.error}>{getErrorMessage(register.error)}</Text> : null}

      <Button label={strings.register.submit} onPress={onSubmit} loading={register.isPending} />
      <Button
        label={strings.register.cta}
        variant="ghost"
        onPress={() => router.replace('/login')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  brand: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 28,
  },
  error: {
    color: colors.danger,
    marginBottom: 12,
  },
});
