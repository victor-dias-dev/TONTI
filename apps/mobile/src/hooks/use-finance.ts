import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Transaction } from '../domain';
import { financeService } from '../services/finance.service';
import { queryKeys } from '../services/query-keys';

export function useDashboard() {
  return useQuery({ queryKey: queryKeys.dashboard, queryFn: financeService.getDashboard });
}

export function useTransactions() {
  return useQuery({ queryKey: queryKeys.transactions, queryFn: financeService.getTransactions });
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

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<Transaction, 'id'>) => financeService.createTransaction(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
