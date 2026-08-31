import { AccountType, TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { balanceDelta } from './mapping';

describe('balanceDelta', () => {
  it('increases a checking account on income and decreases on expense', () => {
    const amount = new Decimal('10.00');
    expect(balanceDelta(AccountType.CHECKING, TransactionType.INCOME, amount).toFixed(2)).toBe(
      '10.00',
    );
    expect(balanceDelta(AccountType.CHECKING, TransactionType.EXPENSE, amount).toFixed(2)).toBe(
      '-10.00',
    );
  });

  it('increases credit card debt on expense and reduces it on payment', () => {
    const amount = new Decimal('10.00');
    expect(balanceDelta(AccountType.CREDIT_CARD, TransactionType.EXPENSE, amount).toFixed(2)).toBe(
      '10.00',
    );
    expect(balanceDelta(AccountType.CREDIT_CARD, TransactionType.INCOME, amount).toFixed(2)).toBe(
      '-10.00',
    );
  });
});
