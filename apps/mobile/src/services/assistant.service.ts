import type { AiConversation } from '../domain';
import { financeApi } from '../api/finance';

export const assistantService = {
  getConversation(): Promise<AiConversation> {
    return financeApi.getAssistant();
  },

  sendMessage(text: string): Promise<AiConversation> {
    return financeApi.sendAssistantMessage(text);
  },
};
