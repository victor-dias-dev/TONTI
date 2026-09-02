import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { AppHeader, AppText, Card, Icon, PrimaryButton } from '../../../components';
import type { HelpArticle, HelpTopic } from '../../../domain';
import { useHelpTopics } from '../../../hooks/use-help';
import { colors, radius } from '../../../theme';

export function HelpScreen() {
  const catalog = useHelpTopics();
  const [query, setQuery] = useState('');
  const topics = useMemo(() => {
    const items = catalog.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items
      .map((topic) => ({
        ...topic,
        articles: topic.articles.filter((article) => article.title.toLowerCase().includes(q)),
      }))
      .filter((topic) => topic.articles.length > 0 || topic.title.toLowerCase().includes(q));
  }, [catalog.data, query]);

  function openArticle(article: HelpArticle) {
    Alert.alert(article.title, article.body);
  }

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <AppText variant="titleLg" color={colors.primary} align="center">
            Como podemos ajudar?
          </AppText>
          <View style={styles.search}>
            <Icon name="search" size={20} color={colors.mutedSoft} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar ajuda"
              placeholderTextColor={colors.mutedSoft}
              accessibilityLabel="Buscar ajuda"
              style={styles.searchInput}
            />
          </View>
        </View>

        {topics.map((topic) => (
          <HelpTopicCard key={topic.id} topic={topic} onOpen={openArticle} />
        ))}

        <View style={styles.support}>
          <View style={styles.supportIcon}>
            <Icon name="headset" size={22} color={colors.primarySoft} />
          </View>
          <AppText variant="titleSm" color={colors.text} align="center">
            Ainda precisa de ajuda?
          </AppText>
          <AppText variant="body" color={colors.muted} align="center">
            Nossa equipe está disponível 24/7 para resolver qualquer problema que você não encontrou
            aqui.
          </AppText>
          <PrimaryButton
            label="Falar com o suporte"
            onPress={() =>
              Alert.alert(
                'Em breve',
                'O chat com o suporte estará disponível em uma próxima etapa.',
              )
            }
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.legal}>
            <Pressable
              onPress={() =>
                Alert.alert('Termos de Uso', 'Os termos de uso serão publicados em breve.')
              }
              accessibilityRole="link"
              accessibilityLabel="Termos de Uso"
            >
              <AppText variant="label" color={colors.mutedSoft}>
                Termos de Uso
              </AppText>
            </Pressable>
            <AppText variant="label" color={colors.border}>
              •
            </AppText>
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Política de Privacidade',
                  'A política de privacidade será publicada em breve.',
                )
              }
              accessibilityRole="link"
              accessibilityLabel="Política de Privacidade"
            >
              <AppText variant="label" color={colors.mutedSoft}>
                Política de Privacidade
              </AppText>
            </Pressable>
          </View>
          <AppText variant="caption" color={colors.mutedSoft} align="center">
            Tonti v1.0.0
          </AppText>
        </View>
      </ScrollView>
    </View>
  );
}

function HelpTopicCard({
  topic,
  onOpen,
}: {
  topic: HelpTopic;
  onOpen: (article: HelpArticle) => void;
}) {
  return (
    <Card padding={20} style={styles.topic}>
      <View style={styles.topicHead}>
        <View style={styles.topicIcon}>
          <Icon name={topic.icon} size={20} color={colors.primary} />
        </View>
        <AppText variant="titleSm" color={colors.primary}>
          {topic.title}
        </AppText>
      </View>
      <View style={styles.articles}>
        {topic.articles.map((article) => (
          <Pressable
            key={article.id}
            onPress={() => onOpen(article)}
            accessibilityRole="button"
            accessibilityLabel={article.title}
            style={({ pressed }) => [styles.article, pressed ? styles.pressed : null]}
          >
            <AppText variant="body" color={colors.muted} style={styles.articleTitle}>
              {article.title}
            </AppText>
            <Icon name="chevronRight" size={16} color={colors.mutedSoft} />
          </Pressable>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 16, paddingTop: 8 },
  hero: { gap: 16, marginBottom: 8 },
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
  topic: {
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  topicHead: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  articles: { gap: 12 },
  article: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  articleTitle: { flex: 1 },
  support: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  footer: {
    paddingTop: 24,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: 16,
    paddingBottom: 16,
  },
  legal: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16 },
  pressed: { opacity: 0.75 },
});
