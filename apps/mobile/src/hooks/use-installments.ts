import { useQuery } from '@tanstack/react-query';
import { installmentsService } from '../services/installments.service';
import { queryKeys } from '../services/query-keys';

export function useInstallments() {
  return useQuery({
    queryKey: queryKeys.installments,
    queryFn: installmentsService.getPlans,
  });
}

export function useInstallment(id: string) {
  return useQuery({
    queryKey: queryKeys.installment(id),
    queryFn: () => installmentsService.getPlan(id),
    enabled: Boolean(id),
  });
}
