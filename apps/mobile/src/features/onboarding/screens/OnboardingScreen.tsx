import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText, Icon, PrimaryButton } from '../../../components';
import type { IconName } from '../../../domain';
import { colors, radius, shadows } from '../../../theme';

const hero = require('../../../../assets/illustrations/onboarding-hero.png');

const tiles: { title: string; description: string; icon: IconName }[] = [
  { title: 'Renda Mensal', description: 'Configure seus ganhos.', icon: 'income' },
  { title: 'Contas Principais', description: 'Conecte seus bancos.', icon: 'bank' },
  { title: 'Cartões', description: 'Monitore gastos.', icon: 'card' },
  { title: 'Metas', description: 'Defina objetivos.', icon: 'flag' },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppText variant="titleLg" color={colors.primary} align="center">
          Seu dinheiro, do seu jeito.
        </AppText>
        <AppText variant="body" color={colors.muted} align="center" style={styles.subtitle}>
          Organize suas finanças com facilidade e alcance seus objetivos mais rápido.
        </AppText>

        <View style={styles.hero}>
          <Image
            source={hero}
            style={styles.heroImage}
            resizeMode="contain"
            accessibilityLabel="Ilustração Tonti"
          />
        </View>

        <View style={styles.grid}>
          {tiles.map((tile) => (
            <View key={tile.title} style={styles.tile}>
              <Icon name={tile.icon} size={20} color={colors.primary} />
              <AppText variant="label">{tile.title}</AppText>
              <AppText variant="caption" color={colors.muted}>
                {tile.description}
              </AppText>
            </View>
          ))}
        </View>

        <PrimaryButton label="Começar agora" onPress={onComplete} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 24, gap: 16 },
  subtitle: { marginBottom: 8 },
  hero: {
    aspectRatio: 1,
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  heroImage: { width: '100%', height: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 16,
    gap: 4,
    ...shadows.card,
  },
});
