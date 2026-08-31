import { useQuery } from '@tanstack/react-query';
import { openFinanceService } from '../services/open-finance.service';
import { queryKeys } from '../services/query-keys';

export function useConnectBenefits() {
  return useQuery({
    queryKey: queryKeys.connectBenefits,
    queryFn: openFinanceService.getBenefits,
  });
}

export function useInstitutions() {
  return useQuery({
    queryKey: queryKeys.institutions,
    queryFn: openFinanceService.getInstitutions,
  });
}
