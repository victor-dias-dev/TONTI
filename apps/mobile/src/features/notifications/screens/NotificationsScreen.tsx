import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppHeader, AppText, Card, Icon } from '../../../components';
import type { AppNotification, NotificationGroup, NotificationTone } from '../../../domain';
import { formatMoney } from '../../../domain';
import { useMarkNotificationsRead, useNotifications } from '../../../hooks/use-notifications';
import { colors, radius } from '../../../theme';

const groupLabels: Record<NotificationGroup, string> = {
  today: 'Hoje',
  yesterday: 'Ontem',
};

export function NotificationsScreen() {
  const list = useNotifications();
  const markRead = useMarkNotificationsRead();
  const items = list.data ?? [];
  const today = items.filter((item) => item.group === 'today');
  const yesterday = items.filter((item) => item.group === 'yesterday');
  const unread = items.some((item) => !item.read);

  return (
    <View style={styles.safe}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.head}>
          <AppText variant="titleLg" color={colors.primary} style={styles.title}>
            Notificações
          </AppText>
          {unread ? (
            <Pressable
              onPress={() => markRead.mutate()}
              accessibilityRole="button"
              accessibilityLabel="Marcar todas como lidas"
            >
              <AppText variant="label" color={colors.primaryMuted}>
                Marcar todas como lidas
              </AppText>
            </Pressable>
          ) : null}
        </View>

        {items.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Icon name="sparkle" size={36} color={colors.primary} />
            </View>
            <AppText variant="titleSm" color={colors.text} align="center">
              Você está em dia
            </AppText>
            <AppText variant="body" color={colors.muted} align="center">
              Nenhuma nova notificação por aqui.
            </AppText>
          </View>
        ) : (
          <View style={styles.groups}>
            <NotificationGroupBlock label={groupLabels.today} items={today} />
            <NotificationGroupBlock label={groupLabels.yesterday} items={yesterday} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function NotificationGroupBlock({ label, items }: { label: string; items: AppNotification[] }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.group}>
      <AppText variant="label" color={colors.muted} style={styles.groupLabel}>
        {label}
      </AppText>
      {items.map((item) => (
        <NotificationCard key={item.id} item={item} />
      ))}
    </View>
  );
}

function NotificationCard({ item }: { item: AppNotification }) {
  const well = toneWell(item.tone);
  const body =
    item.amountCents && item.actor
      ? `Você recebeu ${formatMoney(item.amountCents, { sign: 'never' })} de ${item.actor}.`
      : item.body;

  return (
    <Card padding={20} style={[styles.card, item.read ? null : styles.unread]}>
      {!item.read ? <View style={styles.unreadBar} /> : null}
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: well.bg }]}>
          <Icon name={item.icon} size={22} color={well.fg} />
        </View>
        <View style={styles.copy}>
          <AppText variant={item.read ? 'body' : 'bodySemi'} color={colors.text}>
            {item.title}
          </AppText>
          <AppText variant="label" color={colors.muted} style={styles.body}>
            {body}
          </AppText>
          <AppText variant="caption" color={colors.mutedSoft} style={styles.time}>
            {item.timeLabel}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

function toneWell(tone: NotificationTone) {
  if (tone === 'warning') return { bg: colors.warning, fg: colors.text };
  if (tone === 'primary') return { bg: colors.primarySoft, fg: colors.primaryInk };
  return { bg: colors.border, fg: colors.muted };
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 32, paddingTop: 8 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: { flex: 1 },
  groups: { gap: 32 },
  group: { gap: 8 },
  groupLabel: { textTransform: 'uppercase', letterSpacing: 1.2 },
  card: { borderRadius: radius.lg, overflow: 'hidden' },
  unread: { backgroundColor: colors.surface },
  unreadBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.primary,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  icon: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  body: { marginTop: 4 },
  time: { marginTop: 8 },
  empty: { alignItems: 'center', gap: 8, paddingVertical: 32 },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: radius.pill,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
