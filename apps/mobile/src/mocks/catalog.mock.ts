import type { Account, Card, Category, Profile } from '../domain';

export const mockProfile: Profile = {
  id: 'user-001',
  name: 'Victor',
  email: 'victor@tonti.app',
};

export const mockCategories: Category[] = [
  { id: 'category-food', name: 'Alimentação', icon: 'food', iconBg: 'rgba(255, 218, 214, 0.2)' },
  {
    id: 'category-transport',
    name: 'Transporte',
    icon: 'transport',
    iconBg: 'rgba(187, 232, 228, 0.3)',
  },
  { id: 'category-market', name: 'Mercado', icon: 'market', iconBg: 'rgba(200, 169, 0, 0.2)' },
  { id: 'category-income', name: 'Receita', icon: 'income', iconBg: 'rgba(0, 77, 64, 0.2)' },
  { id: 'category-housing', name: 'Moradia', icon: 'homeCategory', iconBg: '#BBE8E4' },
  { id: 'category-leisure', name: 'Lazer', icon: 'leisure', iconBg: 'rgba(187, 232, 228, 0.3)' },
  { id: 'category-subscription', name: 'Assinatura', icon: 'subscription', iconBg: '#ECEEEE' },
];

export const mockAccounts: Account[] = [
  { id: 'account-nubank', name: 'Nubank', kind: 'checking', balanceCents: '450000', icon: 'bank' },
  { id: 'account-itau', name: 'Itaú', kind: 'checking', balanceCents: '280000', icon: 'bank' },
  { id: 'account-cash', name: 'Dinheiro', kind: 'cash', balanceCents: '30000', icon: 'cash' },
  { id: 'account-inter', name: 'Inter', kind: 'checking', balanceCents: '85000', icon: 'wallet' },
];

export const mockCards: Card[] = [
  {
    id: 'card-inter',
    name: 'Inter Visa',
    brand: 'Visa',
    lastDigits: '4412',
    invoiceCents: '185040',
    limitCents: '500000',
    usedCents: '185040',
    dueLabel: '10 set',
    bestPurchaseDayLabel: '12 set',
    status: 'open',
    accountId: 'account-inter',
  },
  {
    id: 'card-nubank',
    name: 'Nubank Platinum',
    brand: 'Mastercard',
    lastDigits: '8821',
    invoiceCents: '64200',
    limitCents: '300000',
    usedCents: '64200',
    dueLabel: '15 set',
    bestPurchaseDayLabel: '16 set',
    status: 'open',
    accountId: 'account-nubank',
  },
];
