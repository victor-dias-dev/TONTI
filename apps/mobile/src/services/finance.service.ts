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
import { financeApi, type TransactionListParams } from '../api/finance';

export const financeService = {
  getProfile(): Promise<Profile> {
    return financeApi.getProfile();
  },

  getDashboard(): Promise<Dashboard> {
    return financeApi.getDashboard();
  },

  getTransactions(params?: TransactionListParams): Promise<Transaction[]> {
    return financeApi.getTransactions(params);
  },

  getTransaction(id: string): Promise<Transaction> {
    return financeApi.getTransaction(id);
  },

  getRelatedTransactions(id: string): Promise<Transaction[]> {
    return financeApi.getRelatedTransactions(id);
  },

  getAccounts(): Promise<Account[]> {
    return financeApi.getAccounts();
  },

  getAccount(id: string): Promise<Account> {
    return financeApi.getAccount(id);
  },

  getAccountTransactions(accountId: string): Promise<Transaction[]> {
    return financeApi.getAccountTransactions(accountId);
  },

  getAccountActivity(accountId: string): Promise<AccountActivityPoint[]> {
    return financeApi.getAccountActivity(accountId);
  },

  getCards(): Promise<Card[]> {
    return financeApi.getCards();
  },

  getCard(id: string): Promise<Card> {
    return financeApi.getCard(id);
  },

  getInvoice(id: string): Promise<Invoice> {
    return financeApi.getInvoice(id);
  },

  getInvoiceByCard(cardId: string): Promise<Invoice> {
    return financeApi.getInvoiceByCard(cardId);
  },

  getCategories(): Promise<Category[]> {
    return financeApi.getCategories();
  },

  getPlanning(): Promise<PlanningSummary> {
    return financeApi.getPlanning();
  },

  getCategoryTransactions(categoryId: string): Promise<Transaction[]> {
    return financeApi.getCategoryTransactions(categoryId);
  },

  createTransaction(input: Omit<Transaction, 'id'>): Promise<Transaction> {
    return financeApi.createTransaction(input);
  },
};
