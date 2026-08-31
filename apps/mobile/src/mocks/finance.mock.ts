import type { AccountActivityPoint, Dashboard, Invoice, PlanningSummary } from '../domain';
import { mockUpcoming } from './transactions.mock';

export const mockDashboard: Dashboard = {
  balanceCents: '845000',
  incomeCents: '1250000',
  expenseCents: '405000',
  availableCents: '845000',
  variationLabel: '+4.2%',
  spentCents: '405000',
  spentLimitCents: '600000',
  monthLabel: 'Agosto 2026',
  insight: {
    id: 'insight-001',
    text: 'Você gastou 18% menos com alimentação este mês. Continue assim!',
  },
  upcoming: mockUpcoming,
  recentTransactionIds: ['transaction-003', 'transaction-006', 'transaction-007'],
};

export const mockPlanning: PlanningSummary = {
  incomeCents: '1250000',
  plannedCents: '600000',
  remainingCents: '195000',
  budgets: [
    {
      id: 'budget-housing',
      categoryId: 'category-housing',
      plannedCents: '200000',
      spentCents: '170000',
      percentLabel: '85%',
    },
    {
      id: 'budget-food',
      categoryId: 'category-food',
      plannedCents: '160000',
      spentCents: '136000',
      percentLabel: '85%',
    },
    {
      id: 'budget-leisure',
      categoryId: 'category-leisure',
      plannedCents: '80000',
      spentCents: '48000',
      percentLabel: '60%',
    },
    {
      id: 'budget-transport',
      categoryId: 'category-transport',
      plannedCents: '60000',
      spentCents: '66000',
      percentLabel: '110%',
    },
  ],
};

export const mockAccountActivity: Record<string, AccountActivityPoint[]> = {
  'account-nubank': [
    { id: 'activity-nubank-mar', label: 'Mar', cents: '280000' },
    { id: 'activity-nubank-abr', label: 'Abr', cents: '310000' },
    { id: 'activity-nubank-mai', label: 'Mai', cents: '265000' },
    { id: 'activity-nubank-jun', label: 'Jun', cents: '390000' },
    { id: 'activity-nubank-jul', label: 'Jul', cents: '420000' },
    { id: 'activity-nubank-ago', label: 'Ago', cents: '450000' },
  ],
  'account-itau': [
    { id: 'activity-itau-mar', label: 'Mar', cents: '180000' },
    { id: 'activity-itau-abr', label: 'Abr', cents: '210000' },
    { id: 'activity-itau-mai', label: 'Mai', cents: '195000' },
    { id: 'activity-itau-jun', label: 'Jun', cents: '240000' },
    { id: 'activity-itau-jul', label: 'Jul', cents: '260000' },
    { id: 'activity-itau-ago', label: 'Ago', cents: '280000' },
  ],
  'account-cash': [
    { id: 'activity-cash-mar', label: 'Mar', cents: '18000' },
    { id: 'activity-cash-abr', label: 'Abr', cents: '22000' },
    { id: 'activity-cash-mai', label: 'Mai', cents: '15000' },
    { id: 'activity-cash-jun', label: 'Jun', cents: '24000' },
    { id: 'activity-cash-jul', label: 'Jul', cents: '28000' },
    { id: 'activity-cash-ago', label: 'Ago', cents: '30000' },
  ],
  'account-inter': [
    { id: 'activity-inter-mar', label: 'Mar', cents: '520000' },
    { id: 'activity-inter-abr', label: 'Abr', cents: '540000' },
    { id: 'activity-inter-mai', label: 'Mai', cents: '610000' },
    { id: 'activity-inter-jun', label: 'Jun', cents: '580000' },
    { id: 'activity-inter-jul', label: 'Jul', cents: '720000' },
    { id: 'activity-inter-ago', label: 'Ago', cents: '85000' },
  ],
};

export const mockInvoices: Invoice[] = [
  {
    id: 'invoice-001',
    cardId: 'card-inter',
    totalCents: '185040',
    dueLabel: '10 set',
    bestPurchaseDayLabel: '12 set',
    status: 'open',
    transactionIds: ['transaction-009'],
  },
  {
    id: 'invoice-002',
    cardId: 'card-nubank',
    totalCents: '64200',
    dueLabel: '15 set',
    bestPurchaseDayLabel: '16 set',
    status: 'open',
    transactionIds: ['transaction-008'],
  },
];
