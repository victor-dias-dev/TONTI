import type { SubscriptionsSummary } from '../domain';

export const subscriptionsSummary: SubscriptionsSummary = {
  insightYearlyCents: '122000',
  monthlyCents: '10170',
  yearlyCents: '122040',
  items: [
    {
      id: 'netflix',
      name: 'Netflix',
      amountCents: '5990',
      nextDay: 15,
      icon: 'play',
      tone: 'danger',
    },
    {
      id: 'spotify',
      name: 'Spotify',
      amountCents: '2190',
      nextDay: 21,
      icon: 'music',
      tone: 'soft',
    },
    {
      id: 'amazon-prime',
      name: 'Amazon Prime',
      amountCents: '1990',
      nextDay: 28,
      icon: 'truck',
      tone: 'muted',
    },
  ],
};
