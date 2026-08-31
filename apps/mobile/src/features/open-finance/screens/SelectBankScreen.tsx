import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { AppText, Card, Icon, StackHeader } from '../../../components';
import type { Institution } from '../../../domain';
import { useInstitutions } from '../../../hooks/use-open-finance';
import { colors, radius, shadows } from '../../../theme';

export function SelectBankScreen() {
  const institutions = useInstitutions();
  const [query, setQuery] = useState('');
  const { width } = useWindowDimensions();
  const tileSize = (width - 40 - 16) / 2;

  const filtered = useMemo(() => {
    const items = institutions.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [institutions.data, query]);

  const featured = filtered.filter((item) => item.featured);
  const others = filtered.filter((item) => !item.featured);

  function select(institution: Institution) {
    Alert.alert(
      institution.name,
      'A conexão via Open Finance estará disponível em uma próxima etapa.',
      [{ text: 'OK', onPress: () => router.replace('/(app)/accounts') }],
    );
  }

  return (
    <View style={styles.safe}>
      <StackHeader title="Selecionar Instituição" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <AppText variant="titleMd" color={colors.text} align="center">
            Conecte sua conta
          </AppText>
          <AppText variant="body" color={colors.muted} align="center">
            Escolha de onde você quer trazer seus dados com segurança pelo Open Finance.
          </AppText>
        </View>

        <View style={styles.search}>
          <Icon name="search" size={20} color={colors.mutedSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar instituição..."
            placeholderTextColor={colors.mutedSoft}
            accessibilityLabel="Buscar instituição"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.grid}>
          {featured.map((institution) => (
            <Pressable
              key={institution.id}
              onPress={() => select(institution)}
              accessibilityRole="button"
              accessibilityLabel={institution.name}
              style={({ pressed }) => [
                styles.tile,
                { width: tileSize, height: tileSize },
                pressed ? styles.pressed : null,
              ]}
            >
              <View
                style={[
                  styles.logo,
                  {
                    backgroundColor: institution.brandColor,
                    borderRadius: institution.shape === 'rounded' ? radius.sm : radius.pill,
                  },
                ]}
              >
                <AppText variant="titleSm" color={institution.textColor}>
                  {institution.initial}
                </AppText>
              </View>
              <AppText variant="label" color={colors.text} align="center">
                {institution.name}
              </AppText>
            </Pressable>
          ))}
        </View>

        {others.length > 0 ? (
          <View>
            <AppText variant="titleSm" color={colors.text} style={styles.section}>
              Outras instituições
            </AppText>
            <Card padding={0}>
              {others.map((institution, index) => (
                <Pressable
                  key={institution.id}
                  onPress={() => select(institution)}
                  accessibilityRole="button"
                  accessibilityLabel={institution.name}
                  style={({ pressed }) => [
                    styles.other,
                    index < others.length - 1 ? styles.otherBorder : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <View style={styles.otherLeft}>
                    <View style={styles.otherIcon}>
                      <Icon name="bank" size={18} color={colors.muted} />
                    </View>
                    <AppText variant="body">{institution.name}</AppText>
                  </View>
                  <Icon name="chevronRight" size={16} color={colors.mutedSoft} />
                </Pressable>
              ))}
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  intro: { alignItems: 'center', gap: 8, marginBottom: 16, paddingTop: 8 },
  search: {
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  tile: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.chip,
    ...shadows.card,
  },
  logo: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: { marginBottom: 16, paddingHorizontal: 8 },
  other: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  otherBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  otherLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  otherIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
});
