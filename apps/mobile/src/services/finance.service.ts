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
import {
  mockAccountActivity,
  mockAccounts,
  mockCards,
  mockCategories,
  mockDashboard,
  mockInvoices,
  mockPlanning,
  mockProfile,
  mockTransactions,
} from '../mocks';
import { simulateRequest } from './http';

const createdTransactions: Transaction[] = [];

function allTransactions(): Transaction[] {
  return [...createdTransactions, ...mockTransactions];
}

export const financeService = {
  getProfile(): Promise<Profile> {
    return simulateRequest(mockProfile);
  },

  getDashboard(): Promise<Dashboard> {
    return simulateRequest(mockDashboard);
  },

  getTransactions(): Promise<Transaction[]> {
    return simulateRequest(allTransactions());
  },

  async getTransaction(id: string): Promise<Transaction> {
    await simulateRequest(null, 200);
    const transaction = allTransactions().find((item) => item.id === id);
    if (!transaction) {
      throw new Error('Transação não encontrada');
    }
    return transaction;
  },

  getRelatedTransactions(id: string): Promise<Transaction[]> {
    const current = allTransactions().find((item) => item.id === id);
    if (!current) {
      return simulateRequest([]);
    }
    return simulateRequest(
      allTransactions()
        .filter((item) => item.id !== id && item.categoryId === current.categoryId)
        .slice(0, 3),
    );
  },

  getAccounts(): Promise<Account[]> {
    return simulateRequest(mockAccounts);
  },

  getAccount(id: string): Promise<Account> {
    const account = mockAccounts.find((item) => item.id === id);
    if (!account) {
      return Promise.reject(new Error('Conta não encontrada'));
    }
    return simulateRequest(account);
  },

  getAccountTransactions(accountId: string): Promise<Transaction[]> {
    return simulateRequest(allTransactions().filter((item) => item.accountId === accountId));
  },

  getAccountActivity(accountId: string): Promise<AccountActivityPoint[]> {
    return simulateRequest(
      mockAccountActivity[accountId] ?? mockAccountActivity['account-nubank'] ?? [],
    );
  },

  getCards(): Promise<Card[]> {
    return simulateRequest(mockCards);
  },

  getCard(id: string): Promise<Card> {
    const card = mockCards.find((item) => item.id === id);
    if (!card) {
      return Promise.reject(new Error('Cartão não encontrado'));
    }
    return simulateRequest(card);
  },

  getInvoice(id: string): Promise<Invoice> {
    const invoice = mockInvoices.find((item) => item.id === id);
    if (!invoice) {
      return Promise.reject(new Error('Fatura não encontrada'));
    }
    return simulateRequest(invoice);
  },

  getInvoiceByCard(cardId: string): Promise<Invoice> {
    const invoice = mockInvoices.find((item) => item.cardId === cardId);
    if (!invoice) {
      return Promise.reject(new Error('Fatura não encontrada'));
    }
    return simulateRequest(invoice);
  },

  getCategories(): Promise<Category[]> {
    return simulateRequest(mockCategories, 120);
  },

  getPlanning(): Promise<PlanningSummary> {
    return simulateRequest(mockPlanning);
  },

  getCategoryTransactions(categoryId: string): Promise<Transaction[]> {
    return simulateRequest(allTransactions().filter((item) => item.categoryId === categoryId));
  },

  async createTransaction(input: Omit<Transaction, 'id'>): Promise<Transaction> {
    const transaction: Transaction = {
      ...input,
      id: `transaction-${Date.now()}`,
    };
    createdTransactions.unshift(transaction);
    return simulateRequest(transaction, 400);
  },
};
