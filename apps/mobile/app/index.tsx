import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../src/components/Button';
import { Screen } from '../src/components/Screen';
import { strings } from '../src/constants/strings';
import { colors } from '../src/constants/theme';
import { useSession } from '../src/hooks/use-session';

export default function HomeScreen() {
  const { user, isAuthenticated, logout } = useSession();

  if (!isAuthenticated || !user) {
    return <Redirect href="/login" />;
  }

  return (
    <Screen>
      <View>
        <Text style={styles.kicker}>{strings.appName}</Text>
        <Text style={styles.title}>
          {strings.home.title}, {user.name}
        </Text>
        <Text style={styles.subtitle}>{strings.home.subtitle}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <Button label={strings.home.logout} onPress={() => void logout()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kicker: {
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    lineHeight: 24,
    marginBottom: 16,
  },
  email: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 32,
  },
});
