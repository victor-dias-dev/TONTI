import { useQuery } from '@tanstack/react-query';
import { subscriptionsService } from '../services/subscriptions.service';
import { queryKeys } from '../services/query-keys';

export function useSubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: subscriptionsService.getSummary,
  });
}
