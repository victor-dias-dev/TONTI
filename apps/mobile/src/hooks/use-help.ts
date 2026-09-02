import { useQuery } from '@tanstack/react-query';
import { helpService } from '../services/help.service';
import { queryKeys } from '../services/query-keys';

export function useHelpTopics() {
  return useQuery({
    queryKey: queryKeys.help,
    queryFn: helpService.listTopics,
  });
}
