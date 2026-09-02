import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsService } from '../services/subscriptions.service';
import { queryKeys } from '../services/query-keys';

export function useSubscriptions() {
  return useQuery({
    queryKey: queryKeys.subscriptions,
    queryFn: subscriptionsService.getSummary,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.subscriptions });
      await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      await queryClient.invalidateQueries({ queryKey: queryKeys.planning });
    },
  });
}
