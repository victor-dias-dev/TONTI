import type { MoneyCents } from './money';

export type TransactionType = 'expense' | 'income' | 'transfer';
export type AccountKind = 'checking' | 'cash';
export type InvoiceStatus = 'open' | 'closed';
export type IconName =
  | 'home'
  | 'transactions'
  | 'planning'
  | 'accounts'
  | 'more'
  | 'bell'
  | 'plus'
  | 'search'
  | 'filter'
  | 'chevronLeft'
  | 'chevronRight'
  | 'chevronDown'
  | 'close'
  | 'check'
  | 'bank'
  | 'wallet'
  | 'card'
  | 'cash'
  | 'food'
  | 'transport'
  | 'market'
  | 'homeCategory'
  | 'leisure'
  | 'income'
  | 'subscription'
  | 'flag'
  | 'bulb'
  | 'arrowUp'
  | 'arrowDown'
  | 'user'
  | 'grid'
  | 'settings'
  | 'lock'
  | 'crown'
  | 'help'
  | 'logout'
  | 'edit'
  | 'calendar'
  | 'repeat'
  | 'installments'
  | 'robot'
  | 'savings'
  | 'mic'
  | 'send'
  | 'play'
  | 'music'
  | 'truck'
  | 'sync'
  | 'sparkle'
  | 'pieChart'
  | 'shield'
  | 'link';

export interface Category {
  id: string;
  name: string;
  icon: IconName;
  iconBg: string;
}

export interface Account {
  id: string;
  name: string;
  kind: AccountKind;
  balanceCents: MoneyCents;
  icon: IconName;
}

export interface Card {
  id: string;
  name: string;
  brand: string;
  lastDigits: string;
  invoiceCents: MoneyCents;
  limitCents: MoneyCents;
  usedCents: MoneyCents;
  dueLabel: string;
  bestPurchaseDayLabel: string;
  status: InvoiceStatus;
  accountId: string;
}

export interface Transaction {
  id: string;
  description: string;
  amountCents: MoneyCents;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  cardId?: string;
  notes?: string;
  occurredAt: string;
}

export interface UpcomingPayment {
  id: string;
  title: string;
  dueLabel: string;
  amountCents: MoneyCents;
  icon: IconName;
}

export interface Budget {
  id: string;
  categoryId: string;
  plannedCents: MoneyCents;
  spentCents: MoneyCents;
  percentLabel: string;
}

export interface Invoice {
  id: string;
  cardId: string;
  totalCents: MoneyCents;
  dueLabel: string;
  bestPurchaseDayLabel: string;
  status: InvoiceStatus;
  transactionIds: string[];
}

export interface Insight {
  id: string;
  text: string;
}

export interface Dashboard {
  balanceCents: MoneyCents;
  incomeCents: MoneyCents;
  expenseCents: MoneyCents;
  availableCents: MoneyCents;
  variationLabel: string;
  spentCents: MoneyCents;
  spentLimitCents: MoneyCents;
  monthLabel: string;
  insight: Insight;
  upcoming: UpcomingPayment[];
  recentTransactionIds: string[];
}

export interface AccountActivityPoint {
  id: string;
  label: string;
  cents: MoneyCents;
}

export interface PlanningSummary {
  incomeCents: MoneyCents;
  plannedCents: MoneyCents;
  remainingCents: MoneyCents;
  budgets: Budget[];
}

export interface Profile {
  id: string;
  name: string;
  email: string;
}

export type AiRole = 'assistant' | 'user';
export type AiInsightTone = 'income' | 'danger' | 'primary';

export interface AiInsight {
  id: string;
  icon: IconName;
  tone: AiInsightTone;
  text: string;
  amountCents?: MoneyCents;
}

export interface AiMessage {
  id: string;
  role: AiRole;
  text: string;
  insights?: AiInsight[];
}

export interface AiConversation {
  title: string;
  subtitle: string;
  suggestions: string[];
  messages: AiMessage[];
}

export type SubscriptionTone = 'danger' | 'soft' | 'muted';

export interface Subscription {
  id: string;
  name: string;
  amountCents: MoneyCents;
  nextDay: number;
  icon: IconName;
  tone: SubscriptionTone;
}

export interface SubscriptionsSummary {
  insightYearlyCents: MoneyCents;
  monthlyCents: MoneyCents;
  yearlyCents: MoneyCents;
  items: Subscription[];
}

export type InstitutionShape = 'circle' | 'rounded';

export interface Institution {
  id: string;
  name: string;
  initial: string;
  brandColor: string;
  textColor: string;
  shape: InstitutionShape;
  featured: boolean;
}

export interface ConnectBenefit {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export type InstallmentStatus = 'paid' | 'next' | 'upcoming';

export interface Installment {
  id: string;
  index: number;
  monthLabel: string;
  status: InstallmentStatus;
  amountCents: MoneyCents;
  caption: string;
  trailingCaption: string;
}

export interface InstallmentPlan {
  id: string;
  merchant: string;
  occurredAtLabel: string;
  icon: IconName;
  totalCents: MoneyCents;
  installmentCents: MoneyCents;
  installmentCount: number;
  paidCount: number;
  remainingCount: number;
  remainingCents: MoneyCents;
  installments: Installment[];
}
