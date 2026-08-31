import { Decimal } from '@prisma/client/runtime/library';
import { UsersService } from '../../users/users.service';
import { AssistantRepository } from '../repositories/assistant.repository';
import { AssistantService } from './assistant.service';

describe('AssistantService', () => {
  const userId = '11111111-1111-1111-1111-111111111111';
  let service: AssistantService;

  beforeEach(() => {
    service = new AssistantService(
      {
        getSnapshot: jest.fn().mockResolvedValue({
          foodSpent: new Decimal('820'),
          previousFoodSpent: new Decimal('1000'),
          cardSpent: new Decimal('1120'),
          previousCardSpent: new Decimal('1000'),
          income: new Decimal('12500'),
          expense: new Decimal('11850'),
          planned: new Decimal('12500'),
          balance: new Decimal('4320'),
          topExpense: { name: 'Alimentação', amount: new Decimal('820') },
        }),
      } as unknown as AssistantRepository,
      {
        findById: jest.fn().mockResolvedValue({ timezone: 'America/Sao_Paulo' }),
      } as unknown as UsersService,
    );
  });

  it('returns opening insights from live totals', async () => {
    const result = await service.conversation(userId);
    const opening = result.messages[0];

    expect(result.title).toBe('Seu assistente financeiro');
    expect(opening?.insights).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'food', tone: 'income' }),
        expect.objectContaining({ id: 'invoice', tone: 'danger' }),
        expect.objectContaining({ id: 'save', amountCents: '65000' }),
      ]),
    );
  });

  it('answers a finance question using remaining budget', async () => {
    const result = await service.reply(userId, 'Como estão minhas finanças?');
    const last = result.messages.at(-1);

    expect(result.messages).toHaveLength(3);
    expect(last?.role).toBe('assistant');
    expect(last?.text).toContain('abaixo do planejado');
  });
});
