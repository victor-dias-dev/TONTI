import type { AiConversation, AiMessage } from '../domain';
import { assistantConversation, assistantReply } from '../mocks/assistant';

let conversation: AiConversation = {
  ...assistantConversation,
  messages: [...assistantConversation.messages],
};

export const assistantService = {
  getConversation(): Promise<AiConversation> {
    return Promise.resolve({ ...conversation, messages: [...conversation.messages] });
  },

  sendMessage(text: string): Promise<AiConversation> {
    const prompt = text.trim();
    const userMessage: AiMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: prompt,
    };
    conversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage, assistantReply(prompt)],
    };
    return Promise.resolve({ ...conversation, messages: [...conversation.messages] });
  },
};
