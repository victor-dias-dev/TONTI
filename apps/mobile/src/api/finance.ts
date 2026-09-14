import type {
  Account,
  AccountActivityPoint,
  AiConversation,
  Card,
  Category,
  Dashboard,
  InstallmentPlan,
  Invoice,
  PlanningSummary,
  Profile,
  SubscriptionsSummary,
  Transaction,
  UserPreferences,
} from '../domain';
import { apiClient } from './client';

export const financeApi = {
  getProfile() {
    return get<Profile>('/profile');
  },

  updateProfile(payload: Partial<Pick<Profile, 'name' | 'email'>>) {
    return patch<Profile>('/profile', payload);
  },

  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return apiClient.post('/profile/password', payload).then(() => undefined);
  },

  getPreferences() {
    return get<UserPreferences>('/preferences');
  },

  updatePreferences(payload: Partial<UserPreferences>) {
    return patch<UserPreferences>('/preferences', payload);
  },

  getDashboard() {
    return get<Dashboard>('/dashboard');
  },

  getTransactions(params?: TransactionListParams) {
    return get<Transaction[]>('/transactions', params);
  },

  getTransaction(id: string) {
    return get<Transaction>(`/transactions/${id}`);
  },

  getRelatedTransactions(id: string) {
    return get<Transaction[]>(`/transactions/${id}/related`);
  },

  createTransaction(payload: Omit<Transaction, 'id'> & { installmentCount?: number }) {
    return post<Transaction>('/transactions', payload);
  },

  updateTransaction(id: string, payload: Partial<Omit<Transaction, 'id'>>) {
    return patch<Transaction>(`/transactions/${id}`, payload);
  },

  deleteTransaction(id: string) {
    return apiClient.delete(`/transactions/${id}`).then(() => undefined);
  },

  getAccounts() {
    return get<Account[]>('/accounts');
  },

  getAccount(id: string) {
    return get<Account>(`/accounts/${id}`);
  },

  getAccountTransactions(id: string) {
    return get<Transaction[]>(`/accounts/${id}/transactions`);
  },

  getAccountActivity(id: string) {
    return get<AccountActivityPoint[]>(`/accounts/${id}/activity`);
  },

  getCards() {
    return get<Card[]>('/credit-cards');
  },

  getCard(id: string) {
    return get<Card>(`/credit-cards/${id}`);
  },

  createCard(payload: {
    name: string;
    brand: string;
    lastDigits: string;
    limitCents: string;
    closingDay: number;
    dueDay: number;
  }) {
    return post<Card>('/credit-cards', payload);
  },

  getInvoiceByCard(cardId: string) {
    return get<Invoice>(`/credit-cards/${cardId}/invoices/current`);
  },

  getInvoice(id: string) {
    return get<Invoice>(`/credit-cards/${id.split(':')[0]}/invoices/${id}`);
  },

  getCategories() {
    return get<Category[]>('/categories');
  },

  createCategory(
    payload: Pick<Category, 'name' | 'icon' | 'iconBg'> & { type: NonNullable<Category['type']> },
  ) {
    return post<Category>('/categories', payload);
  },

  updateCategory(id: string, payload: Partial<Pick<Category, 'name' | 'icon' | 'iconBg'>>) {
    return patch<Category>(`/categories/${id}`, payload);
  },

  deleteCategory(id: string) {
    return apiClient.delete(`/categories/${id}`).then(() => undefined);
  },

  getPlanning() {
    return get<PlanningSummary>('/budgets');
  },

  createBudget(payload: { categoryId: string; month: string; amountCents: string }) {
    return post<PlanningSummary['budgets'][number]>('/budgets', payload);
  },

  deleteBudget(id: string) {
    return apiClient.delete(`/budgets/${id}`).then(() => undefined);
  },

  getCategoryTransactions(categoryId: string) {
    return get<Transaction[]>('/transactions', { categoryId });
  },

  getAssistant() {
    return get<AiConversation>('/assistant');
  },

  sendAssistantMessage(text: string) {
    return post<AiConversation>('/assistant/messages', { text });
  },

  getSubscriptions() {
    return get<SubscriptionsSummary>('/subscriptions');
  },

  createSubscription(payload: {
    name: string;
    amountCents: string;
    accountId: string;
    categoryId: string;
    frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    nextChargeDate: string;
  }) {
    return post<SubscriptionsSummary['items'][number]>('/subscriptions', payload);
  },

  getInstallments() {
    return get<InstallmentPlan[]>('/installments');
  },

  getInstallment(id: string) {
    return get<InstallmentPlan>(`/installments/${id}`);
  },
};

export interface TransactionListParams {
  month?: string;
  from?: string;
  to?: string;
  categoryId?: string;
  accountId?: string;
  type?: Transaction['type'];
  q?: string;
}

async function get<T>(url: string, params?: object): Promise<T> {
  const { data } = await apiClient.get<T>(url, { params });
  return data;
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.post<T>(url, body);
  return data;
}

async function patch<T>(url: string, body: unknown): Promise<T> {
  const { data } = await apiClient.patch<T>(url, body);
  return data;
}
