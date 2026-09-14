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
import { asIconName } from '../utils/lookups';

function mapCategory(category: Category): Category {
  return { ...category, icon: asIconName(category.icon) };
}

export const financeService = {
  getProfile(): Promise<Profile> {
    return financeApi.getProfile();
  },

  updateProfile(payload: Partial<Pick<Profile, 'name' | 'email'>>): Promise<Profile> {
    return financeApi.updateProfile(payload);
  },

  changePassword(payload: { currentPassword: string; newPassword: string }): Promise<void> {
    return financeApi.changePassword(payload);
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

  createCard(payload: {
    name: string;
    brand: string;
    lastDigits: string;
    limitCents: string;
    closingDay: number;
    dueDay: number;
  }): Promise<Card> {
    return financeApi.createCard(payload);
  },

  getInvoice(id: string): Promise<Invoice> {
    return financeApi.getInvoice(id);
  },

  getInvoiceByCard(cardId: string): Promise<Invoice> {
    return financeApi.getInvoiceByCard(cardId);
  },

  getCategories(): Promise<Category[]> {
    return financeApi.getCategories().then((items) => items.map(mapCategory));
  },

  createCategory(
    payload: Pick<Category, 'name' | 'icon' | 'iconBg'> & { type: NonNullable<Category['type']> },
  ): Promise<Category> {
    return financeApi.createCategory(payload).then(mapCategory);
  },

  updateCategory(
    id: string,
    payload: Partial<Pick<Category, 'name' | 'icon' | 'iconBg'>>,
  ): Promise<Category> {
    return financeApi.updateCategory(id, payload).then(mapCategory);
  },

  deleteCategory(id: string): Promise<void> {
    return financeApi.deleteCategory(id);
  },

  getPlanning(): Promise<PlanningSummary> {
    return financeApi.getPlanning();
  },

  createBudget(payload: {
    categoryId: string;
    month: string;
    amountCents: string;
  }): Promise<PlanningSummary['budgets'][number]> {
    return financeApi.createBudget(payload);
  },

  deleteBudget(id: string): Promise<void> {
    return financeApi.deleteBudget(id);
  },

  getCategoryTransactions(categoryId: string): Promise<Transaction[]> {
    return financeApi.getCategoryTransactions(categoryId);
  },

  createTransaction(
    input: Omit<Transaction, 'id'> & { installmentCount?: number },
  ): Promise<Transaction> {
    return financeApi.createTransaction({
      ...toTransactionPayload(input),
      ...(input.installmentCount && input.installmentCount > 1
        ? { installmentCount: input.installmentCount }
        : {}),
    });
  },

  updateTransaction(id: string, input: Omit<Transaction, 'id'>): Promise<Transaction> {
    return financeApi.updateTransaction(id, toTransactionPayload(input));
  },

  deleteTransaction(id: string): Promise<void> {
    return financeApi.deleteTransaction(id);
  },
};

function toTransactionPayload(input: Omit<Transaction, 'id'>): Omit<Transaction, 'id'> {
  return {
    description: input.description,
    amountCents: input.amountCents,
    type: input.type,
    categoryId: input.categoryId,
    accountId: input.accountId,
    occurredAt: input.occurredAt,
    notes: input.notes?.trim() ? input.notes.trim() : '',
    ...(input.cardId ? { cardId: input.cardId } : {}),
  };
}
