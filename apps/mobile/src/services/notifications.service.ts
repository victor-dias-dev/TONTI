import type { AppNotification } from '../domain';

let notifications: AppNotification[] = [
  {
    id: 'n1',
    group: 'today',
    title: 'Fatura do Nubank vence amanhã',
    body: 'Lembre-se de pagar para evitar juros.',
    timeLabel: 'Há 2 horas',
    read: false,
    icon: 'bell',
    tone: 'primary',
  },
  {
    id: 'n2',
    group: 'today',
    title: 'Você gastou menos com alimentação esta semana',
    body: 'Ótimo trabalho mantendo o orçamento!',
    timeLabel: 'Há 5 horas',
    read: true,
    icon: 'bulb',
    tone: 'warning',
  },
  {
    id: 'n3',
    group: 'yesterday',
    title: 'Transferência recebida',
    body: 'Você recebeu de João Silva.',
    timeLabel: 'Ontem, 14:30',
    read: true,
    icon: 'sync',
    tone: 'muted',
    amountCents: '15000',
    actor: 'João Silva',
  },
];

export const notificationsService = {
  list(): Promise<AppNotification[]> {
    return Promise.resolve(notifications.map((item) => ({ ...item })));
  },

  markAllRead(): Promise<AppNotification[]> {
    notifications = notifications.map((item) => ({ ...item, read: true }));
    return Promise.resolve(notifications.map((item) => ({ ...item })));
  },
};
