import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';
import { TextField } from '../src/components/TextField';
import { strings } from '../src/constants/strings';
import { colors } from '../src/constants/theme';
import { useLogin } from '../src/hooks/use-login';
import { useSession } from '../src/hooks/use-session';
import { LoginFormValues, loginSchema } from '../src/schemas/auth';
import { getErrorMessage } from '../src/utils/error-message';

export default function LoginScreen() {
  const { isAuthenticated } = useSession();
  const login = useLogin();
  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const onSubmit = handleSubmit((values) => {
    login.mutate(values);
  });

  return (
    <Screen>
      <Text style={styles.brand}>{strings.appName}</Text>
      <Text style={styles.title}>{strings.login.title}</Text>
      <Text style={styles.subtitle}>{strings.login.subtitle}</Text>

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

      {login.error ? <Text style={styles.error}>{getErrorMessage(login.error)}</Text> : null}

      <Button label={strings.login.submit} onPress={onSubmit} loading={login.isPending} />
      <Button label={strings.login.cta} variant="ghost" onPress={() => router.push('/register')} />
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
