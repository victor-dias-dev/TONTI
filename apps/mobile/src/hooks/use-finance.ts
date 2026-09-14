import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { IconName, Transaction } from '../domain';
import type { TransactionListParams } from '../api/finance';
import { financeService } from '../services/finance.service';
import { queryKeys } from '../services/query-keys';
import { useAuthStore } from '../stores/auth-store';

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: financeService.getDashboard });
}

export function useTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: [...queryKeys.transactions, params] as const,
    queryFn: () => financeService.getTransactions(params),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => financeService.getTransaction(id),
    enabled: Boolean(id),
  });
}

export function useRelatedTransactions(id: string) {
  return useQuery({
    queryKey: queryKeys.relatedTransactions(id),
    queryFn: () => financeService.getRelatedTransactions(id),
    enabled: Boolean(id),
  });
}

export function useAccounts() {
  return useQuery({ queryKey: queryKeys.accounts, queryFn: financeService.getAccounts });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => financeService.getAccount(id),
    enabled: Boolean(id),
  });
}

export function useAccountTransactions(id: string) {
  return useQuery({
    queryKey: queryKeys.accountTransactions(id),
    queryFn: () => financeService.getAccountTransactions(id),
    enabled: Boolean(id),
  });
}

export function useAccountActivity(id: string) {
  return useQuery({
    queryKey: queryKeys.accountActivity(id),
    queryFn: () => financeService.getAccountActivity(id),
    enabled: Boolean(id),
  });
}

export function useCards() {
  return useQuery({ queryKey: queryKeys.cards, queryFn: financeService.getCards });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createCard,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.cards });
      await queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useCard(id: string) {
  return useQuery({
    queryKey: queryKeys.card(id),
    queryFn: () => financeService.getCard(id),
    enabled: Boolean(id),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: queryKeys.invoice(id),
    queryFn: () => financeService.getInvoice(id),
    enabled: Boolean(id),
  });
}

export function useInvoiceByCard(cardId: string) {
  return useQuery({
    queryKey: queryKeys.invoiceByCard(cardId),
    queryFn: () => financeService.getInvoiceByCard(cardId),
    enabled: Boolean(cardId),
  });
}

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: financeService.getCategories });
}

export function usePlanning() {
  return useQuery({ queryKey: queryKeys.planning, queryFn: financeService.getPlanning });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createBudget,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.planning });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeService.deleteBudget(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.planning });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useCategoryTransactions(id: string) {
  return useQuery({
    queryKey: queryKeys.categoryTransactions(id),
    queryFn: () => financeService.getCategoryTransactions(id),
    enabled: Boolean(id),
  });
}

export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile, queryFn: financeService.getProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  return useMutation({
    mutationFn: (payload: { name: string; email: string }) => financeService.updateProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile, profile);
      const current = useAuthStore.getState().user;
      if (current) {
        updateUser({ ...current, name: profile.name, email: profile.email });
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      financeService.changePassword(payload),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: financeService.createCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<{ name: string; icon: IconName; iconBg: string }>;
    }) => financeService.updateCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeService.deleteCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Transaction, 'id'> & { installmentCount?: number }) =>
      financeService.createTransaction(input),
    onSuccess: () => invalidateLedger(queryClient),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Omit<Transaction, 'id'> }) =>
      financeService.updateTransaction(id, input),
    onSuccess: async (_data, { id }) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.transaction(id) });
      await invalidateLedger(queryClient);
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => financeService.deleteTransaction(id),
    onSuccess: async (_data, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.transaction(id) });
      await invalidateLedger(queryClient);
    },
  });
}

function invalidateLedger(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.transactions }),
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard }),
    queryClient.invalidateQueries({ queryKey: queryKeys.accounts }),
    queryClient.invalidateQueries({ queryKey: queryKeys.planning }),
    queryClient.invalidateQueries({ queryKey: queryKeys.cards }),
    queryClient.invalidateQueries({ queryKey: queryKeys.installments }),
    queryClient.invalidateQueries({ queryKey: queryKeys.assistant }),
    queryClient.invalidateQueries({ queryKey: queryKeys.categories }),
  ]);
}
