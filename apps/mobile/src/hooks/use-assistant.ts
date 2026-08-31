import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assistantService } from '../services/assistant.service';
import { queryKeys } from '../services/query-keys';

export function useAssistant() {
  return useQuery({
    queryKey: queryKeys.assistant,
    queryFn: assistantService.getConversation,
  });
}

export function useSendAssistantMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => assistantService.sendMessage(text),
    onSuccess: (conversation) => {
      queryClient.setQueryData(queryKeys.assistant, conversation);
    },
  });
}
