import type { IconName, Installment, InstallmentPlan, MoneyCents } from '../domain';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function timesCents(cents: MoneyCents, count: number): MoneyCents {
  return (BigInt(cents) * BigInt(count)).toString();
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function buildInstallments(
  count: number,
  paidCount: number,
  amountCents: MoneyCents,
  startMonthIndex: number,
  dueDay: number,
): Installment[] {
  return Array.from({ length: count }, (_, offset) => {
    const index = offset + 1;
    const monthIndex = (startMonthIndex + offset) % 12;
    const due = `${pad(dueDay)}/${pad(monthIndex + 1)}`;
    const paid = index <= paidCount;
    const next = index === paidCount + 1;

    return {
      id: String(index),
      index,
      monthLabel: months[monthIndex] ?? '',
      status: paid ? 'paid' : next ? 'next' : 'upcoming',
      amountCents,
      caption: paid ? `Paga em ${due}` : next ? 'Próxima' : 'A vencer',
      trailingCaption: next ? `Vence em ${due}` : `${index}/${count}`,
    };
  });
}

function plan(input: {
  id: string;
  merchant: string;
  occurredAtLabel: string;
  icon: IconName;
  installmentCents: MoneyCents;
  installmentCount: number;
  paidCount: number;
  startMonthIndex: number;
  dueDay: number;
}): InstallmentPlan {
  const remainingCount = input.installmentCount - input.paidCount;
  return {
    id: input.id,
    merchant: input.merchant,
    occurredAtLabel: input.occurredAtLabel,
    icon: input.icon,
    installmentCents: input.installmentCents,
    installmentCount: input.installmentCount,
    paidCount: input.paidCount,
    totalCents: timesCents(input.installmentCents, input.installmentCount),
    remainingCount,
    remainingCents: timesCents(input.installmentCents, remainingCount),
    installments: buildInstallments(
      input.installmentCount,
      input.paidCount,
      input.installmentCents,
      input.startMonthIndex,
      input.dueDay,
    ),
  };
}

export const installmentPlans: InstallmentPlan[] = [
  plan({
    id: 'amazon',
    merchant: 'Amazon',
    occurredAtLabel: '12 de Out, 14:30',
    icon: 'market',
    installmentCents: '20000',
    installmentCount: 12,
    paidCount: 3,
    startMonthIndex: 9,
    dueDay: 12,
  }),
  plan({
    id: 'magalu',
    merchant: 'Magazine Luiza',
    occurredAtLabel: '03 de Ago, 11:05',
    icon: 'homeCategory',
    installmentCents: '24990',
    installmentCount: 6,
    paidCount: 4,
    startMonthIndex: 7,
    dueDay: 3,
  }),
  plan({
    id: 'apple',
    merchant: 'Apple',
    occurredAtLabel: '20 de Jul, 16:42',
    icon: 'leisure',
    installmentCents: '84990',
    installmentCount: 10,
    paidCount: 1,
    startMonthIndex: 6,
    dueDay: 20,
  }),
  plan({
    id: 'decathlon',
    merchant: 'Decathlon',
    occurredAtLabel: '15 de Jun, 10:18',
    icon: 'transport',
    installmentCents: '18750',
    installmentCount: 4,
    paidCount: 2,
    startMonthIndex: 5,
    dueDay: 15,
  }),
];
