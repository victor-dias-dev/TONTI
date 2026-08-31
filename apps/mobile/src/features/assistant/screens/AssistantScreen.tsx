import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, AppText, Icon } from '../../../components';
import type { AiInsight, AiInsightTone, AiMessage } from '../../../domain';
import { formatMoneyCompact } from '../../../domain';
import { useAssistant, useSendAssistantMessage } from '../../../hooks/use-assistant';
import { colors, radius, shadows } from '../../../theme';

export function AssistantScreen() {
  const insets = useSafeAreaInsets();
  const conversation = useAssistant();
  const send = useSendAssistantMessage();
  const [draft, setDraft] = useState('');
  const data = conversation.data;

  function submit(text: string) {
    const prompt = text.trim();
    if (!prompt || send.isPending) return;
    send.mutate(prompt);
    setDraft('');
  }

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <AppText variant="titleLg" color={colors.primary}>
            {data?.title ?? 'Seu assistente financeiro'}
          </AppText>
          <AppText variant="body" color={colors.muted}>
            {data?.subtitle ?? 'Inteligência a favor do seu bolso.'}
          </AppText>
        </View>

        {(data?.messages ?? []).map((message) => (
          <MessageBlock key={message.id} message={message} onInsightPress={submit} />
        ))}
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {(data?.suggestions ?? []).map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => submit(suggestion)}
              accessibilityRole="button"
              accessibilityLabel={suggestion}
              style={({ pressed }) => [styles.chip, pressed ? styles.pressed : null]}
            >
              <AppText variant="label" color={colors.muted}>
                {suggestion}
              </AppText>
            </Pressable>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <View style={styles.field}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Pergunte sobre suas finanças..."
              placeholderTextColor={colors.mutedSoft}
              accessibilityLabel="Pergunte sobre suas finanças"
              style={styles.input}
              onSubmitEditing={() => submit(draft)}
              returnKeyType="send"
            />
            <Pressable accessibilityRole="button" accessibilityLabel="Falar" style={styles.mic}>
              <Icon name="mic" size={20} color={colors.mutedSoft} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => submit(draft)}
            accessibilityRole="button"
            accessibilityLabel="Enviar"
            style={({ pressed }) => [styles.send, pressed ? styles.pressed : null]}
          >
            <Icon name="send" size={20} color={colors.onPrimary} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function MessageBlock({
  message,
  onInsightPress,
}: {
  message: AiMessage;
  onInsightPress: (text: string) => void;
}) {
  if (message.role === 'user') {
    return (
      <View style={styles.userWrap}>
        <View style={styles.userBubble}>
          <AppText variant="body" color={colors.onPrimary}>
            {message.text}
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantRow}>
      <View style={styles.avatar}>
        <Icon name="robot" size={20} color={colors.onPrimary} />
      </View>
      <View style={styles.assistantCol}>
        <View style={styles.assistantBubble}>
          <AppText variant="body">{message.text}</AppText>
        </View>
        {(message.insights ?? []).map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            onPress={() => onInsightPress(insightLabel(insight))}
          />
        ))}
      </View>
    </View>
  );
}

function InsightCard({ insight, onPress }: { insight: AiInsight; onPress: () => void }) {
  const well = insightWell(insight.tone);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={insightLabel(insight)}
      style={({ pressed }) => [styles.insight, pressed ? styles.pressed : null]}
    >
      {insight.tone === 'primary' ? (
        <View style={styles.watermark} pointerEvents="none">
          <Icon name="savings" size={96} color={colors.primary} />
        </View>
      ) : null}
      <View style={[styles.insightIcon, { backgroundColor: well.bg }]}>
        <Icon name={insight.icon} size={20} color={well.fg} />
      </View>
      <AppText variant="bodySemi" color={insight.tone === 'danger' ? colors.text : colors.primary}>
        {insightLabel(insight)}
      </AppText>
    </Pressable>
  );
}

function insightLabel(insight: AiInsight) {
  if (!insight.amountCents) return insight.text;
  return `${insight.text}${formatMoneyCompact(insight.amountCents)}.`;
}

function insightWell(tone: AiInsightTone) {
  if (tone === 'danger') return { bg: colors.dangerSoft, fg: colors.danger };
  if (tone === 'primary') return { bg: colors.primary, fg: colors.onPrimary };
  return { bg: colors.incomeSoft, fg: colors.primary };
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 16, paddingTop: 8 },
  assistantRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  assistantCol: { flex: 1, gap: 16 },
  assistantBubble: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderTopLeftRadius: radius.sm,
    padding: 20,
    ...shadows.card,
  },
  userWrap: { alignItems: 'flex-end' },
  userBubble: {
    maxWidth: '86%',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    borderTopRightRadius: radius.sm,
    padding: 16,
  },
  insight: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  watermark: {
    position: 'absolute',
    right: -16,
    bottom: -24,
    opacity: 0.05,
  },
  composer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.overlay,
    paddingTop: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  chips: { gap: 8, paddingRight: 12 },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12 },
  field: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.xxl,
    backgroundColor: colors.chip,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    fontFamily: 'Inter_400Regular',
    paddingVertical: 16,
  },
  mic: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  send: {
    width: 56,
    height: 56,
    borderRadius: radius.xxl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  pressed: { opacity: 0.85 },
});
