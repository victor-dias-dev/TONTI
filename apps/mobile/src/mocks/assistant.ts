import type { AiConversation, AiMessage } from '../domain';
import { formatMoneyCompact } from '../domain';

const opening: AiMessage = {
  id: 'msg-1',
  role: 'assistant',
  text: 'Oi! Analisei suas finanças deste mês.',
  insights: [
    {
      id: 'food',
      icon: 'food',
      tone: 'income',
      text: 'Gastou 18% menos com alimentação.',
    },
    {
      id: 'invoice',
      icon: 'card',
      tone: 'danger',
      text: 'Fatura do cartão 12% maior.',
    },
    {
      id: 'save',
      icon: 'savings',
      tone: 'primary',
      text: 'Pode guardar ',
      amountCents: '65000',
    },
  ],
};

export const assistantConversation: AiConversation = {
  title: 'Seu assistente financeiro',
  subtitle: 'Inteligência a favor do seu bolso.',
  suggestions: ['Como estão minhas finanças?', 'Onde estou gastando mais?', 'Posso comprar isso?'],
  messages: [opening],
};

const replies: Record<string, string> = {
  'Como estão minhas finanças?':
    'Neste mês você está 8% abaixo do planejado. O saldo disponível cobre os próximos pagamentos.',
  'Onde estou gastando mais?':
    'Alimentação e cartão de crédito concentram a maior parte das saídas. Vale revisar a fatura.',
  'Posso comprar isso?': `Com o ritmo atual, uma compra de até ${formatMoneyCompact('65000')} não compromete o planejamento do mês.`,
};

export function assistantReply(prompt: string): AiMessage {
  return {
    id: `msg-${Date.now()}-ai`,
    role: 'assistant',
    text:
      replies[prompt] ?? 'Ainda estou aprendendo. Em breve respondo isso com os seus dados reais.',
  };
}
