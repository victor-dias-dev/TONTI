import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { monthRange, previousMonthRange } from '../../../common/dates/zoned-time';
import { formatBrlFromCents } from '../../../common/labels/pt-br';
import { decimalToCents } from '../../../common/money/money';
import { UsersService } from '../../users/users.service';
import type {
  AssistantConversationDto,
  AssistantInsightDto,
  AssistantMessageDto,
} from '../dto/assistant.dto';
import { AssistantRepository, type AssistantSnapshot } from '../repositories/assistant.repository';

const TITLE = 'Seu assistente financeiro';
const SUBTITLE = 'Inteligência a favor do seu bolso.';
const SUGGESTIONS = [
  'Como estão minhas finanças?',
  'Onde estou gastando mais?',
  'Posso comprar isso?',
];

@Injectable()
export class AssistantService {
  constructor(
    private readonly assistantRepository: AssistantRepository,
    private readonly usersService: UsersService,
  ) {}

  async conversation(userId: string): Promise<AssistantConversationDto> {
    const snapshot = await this.snapshot(userId);
    return {
      title: TITLE,
      subtitle: SUBTITLE,
      suggestions: SUGGESTIONS,
      messages: [this.opening(snapshot)],
    };
  }

  async reply(userId: string, text: string): Promise<AssistantConversationDto> {
    const snapshot = await this.snapshot(userId);
    const prompt = text.trim();
    const userMessage: AssistantMessageDto = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: prompt,
    };

    return {
      title: TITLE,
      subtitle: SUBTITLE,
      suggestions: SUGGESTIONS,
      messages: [this.opening(snapshot), userMessage, this.answer(prompt, snapshot)],
    };
  }

  private async snapshot(userId: string): Promise<AssistantSnapshot> {
    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const now = new Date();
    const current = monthRange(now, timeZone);
    const previous = previousMonthRange(now, timeZone);
    return this.assistantRepository.getSnapshot(userId, current.start, current.end, previous.start);
  }

  private opening(snapshot: AssistantSnapshot): AssistantMessageDto {
    return {
      id: 'opening',
      role: 'assistant',
      text: 'Oi! Analisei suas finanças deste mês.',
      insights: this.insights(snapshot),
    };
  }

  private insights(snapshot: AssistantSnapshot): AssistantInsightDto[] {
    const food = percentDelta(snapshot.foodSpent, snapshot.previousFoodSpent);
    const card = percentDelta(snapshot.cardSpent, snapshot.previousCardSpent);
    const remaining = remainingCents(snapshot);

    return [
      {
        id: 'food',
        icon: 'food',
        tone: food.direction <= 0n ? 'income' : 'danger',
        text:
          food.previous === 0n
            ? 'Acompanhe seus gastos com alimentação neste mês.'
            : food.direction <= 0n
              ? `Gastou ${food.percent}% menos com alimentação.`
              : `Gastou ${food.percent}% mais com alimentação.`,
      },
      {
        id: 'invoice',
        icon: 'card',
        tone: card.direction > 0n ? 'danger' : 'income',
        text:
          card.previous === 0n
            ? 'Acompanhe a fatura do cartão neste mês.'
            : card.direction > 0n
              ? `Fatura do cartão ${card.percent}% maior.`
              : `Fatura do cartão ${card.percent}% menor.`,
      },
      {
        id: 'save',
        icon: 'savings',
        tone: 'primary',
        text: remaining === '0' ? 'O planejamento do mês já está no limite.' : 'Pode guardar ',
        ...(remaining === '0' ? {} : { amountCents: remaining }),
      },
    ];
  }

  private answer(prompt: string, snapshot: AssistantSnapshot): AssistantMessageDto {
    const remaining = remainingCents(snapshot);
    const normalized = prompt.toLowerCase();
    let text = 'Ainda estou aprendendo. Em breve respondo isso com os seus dados reais.';

    if (normalized.includes('finanças') || normalized.includes('financas')) {
      const planned = BigInt(decimalToCents(snapshot.planned));
      const spent = BigInt(decimalToCents(snapshot.expense));
      if (planned > 0n && spent < planned) {
        const percent = ((planned - spent) * 100n) / planned;
        text = `Neste mês você está ${percent}% abaixo do planejado. O saldo disponível cobre os próximos pagamentos.`;
      } else if (planned > 0n) {
        text = 'Neste mês os gastos já superaram o planejado. Vale revisar as próximas saídas.';
      } else {
        text = 'Acompanhe entradas e saídas para eu conseguir comparar com o seu planejamento.';
      }
    } else if (normalized.includes('gastando') || normalized.includes('gastos')) {
      text = snapshot.topExpense
        ? `${snapshot.topExpense.name} concentra a maior parte das saídas neste mês.`
        : 'Ainda não há gastos suficientes neste mês para apontar uma categoria.';
    } else if (normalized.includes('comprar') || normalized.includes('posso')) {
      text =
        remaining === '0'
          ? 'Com o ritmo atual, uma compra extra comprometeria o planejamento do mês.'
          : `Com o ritmo atual, uma compra de até ${formatBrlFromCents(remaining, true)} não compromete o planejamento do mês.`;
    }

    return { id: `assistant-${Date.now()}`, role: 'assistant', text };
  }
}

function percentDelta(current: Decimal, previous: Decimal) {
  const currentCents = BigInt(decimalToCents(current));
  const previousCents = BigInt(decimalToCents(previous));
  if (previousCents === 0n) {
    return { previous: 0n, direction: 0n, percent: 0n };
  }
  const direction = currentCents - previousCents;
  const percent = ((direction < 0n ? -direction : direction) * 100n) / previousCents;
  return { previous: previousCents, direction, percent };
}

function remainingCents(snapshot: AssistantSnapshot): string {
  const planned = snapshot.planned.gt(0) ? snapshot.planned : snapshot.income;
  const leftover = planned.minus(snapshot.expense);
  if (leftover.lte(0)) {
    return '0';
  }
  return decimalToCents(leftover);
}
