import type {
  Account,
  AccountActivityPoint,
  Card,
  Category,
  Dashboard,
  Invoice,
  PlanningSummary,
  Profile,
  Transaction,
} from '../domain';
import { apiClient } from './client';

export const financeApi = {
  getProfile() {
    return get<Profile>('/profile');
  },

  updateProfile(payload: Partial<Pick<Profile, 'name'>>) {
    return patch<Profile>('/profile', payload);
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

  createTransaction(payload: Omit<Transaction, 'id'>) {
    return post<Transaction>('/transactions', payload);
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

  getInvoiceByCard(cardId: string) {
    return get<Invoice>(`/credit-cards/${cardId}/invoices/current`);
  },

  getInvoice(id: string) {
    return get<Invoice>(`/credit-cards/${id.split(':')[0]}/invoices/${id}`);
  },

  getCategories() {
    return get<Category[]>('/categories');
  },

  getPlanning() {
    return get<PlanningSummary>('/budgets');
  },

  getCategoryTransactions(categoryId: string) {
    return get<Transaction[]>('/transactions', { categoryId });
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
