import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserPreferences } from '../domain';
import { useSession } from './use-session';
import { preferencesService } from '../services/preferences.service';
import { queryKeys } from '../services/query-keys';

export function usePreferences() {
  const { isAuthenticated } = useSession();
  return useQuery({
    queryKey: queryKeys.preferences,
    queryFn: preferencesService.get,
    enabled: isAuthenticated,
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<UserPreferences>) => preferencesService.update(patch),
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.preferences });
      const previous = queryClient.getQueryData<UserPreferences>(queryKeys.preferences);
      if (previous) {
        queryClient.setQueryData(queryKeys.preferences, { ...previous, ...patch });
      }
      return { previous };
    },
    onError: (_error, _patch, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.preferences, context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.preferences, data);
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.planning });
      void queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
}
