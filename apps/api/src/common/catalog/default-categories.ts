import { CategoryType } from '@prisma/client';

export const DEFAULT_CATEGORIES: Array<{
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isSystem: true;
}> = [
  {
    name: 'Alimentação',
    type: CategoryType.EXPENSE,
    icon: 'food',
    color: 'rgba(255, 218, 214, 0.2)',
    isSystem: true,
  },
  {
    name: 'Transporte',
    type: CategoryType.EXPENSE,
    icon: 'transport',
    color: 'rgba(187, 232, 228, 0.3)',
    isSystem: true,
  },
  {
    name: 'Mercado',
    type: CategoryType.EXPENSE,
    icon: 'market',
    color: 'rgba(200, 169, 0, 0.2)',
    isSystem: true,
  },
  {
    name: 'Receita',
    type: CategoryType.INCOME,
    icon: 'income',
    color: 'rgba(0, 77, 64, 0.2)',
    isSystem: true,
  },
  {
    name: 'Moradia',
    type: CategoryType.EXPENSE,
    icon: 'homeCategory',
    color: '#BBE8E4',
    isSystem: true,
  },
  {
    name: 'Lazer',
    type: CategoryType.EXPENSE,
    icon: 'leisure',
    color: 'rgba(187, 232, 228, 0.3)',
    isSystem: true,
  },
  {
    name: 'Assinatura',
    type: CategoryType.EXPENSE,
    icon: 'subscription',
    color: '#ECEEEE',
    isSystem: true,
  },
];
