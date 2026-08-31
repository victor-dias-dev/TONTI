import { Injectable } from '@nestjs/common';
import { Prisma, type Budget } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { BudgetsRepository } from './budgets.repository';

@Injectable()
export class PrismaBudgetsRepository extends BudgetsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findByUserAndMonth(userId: string, month: Date): Promise<Budget[]> {
    return this.prisma.budget.findMany({
      where: { userId, month },
      orderBy: { createdAt: 'asc' },
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Budget | null> {
    return this.prisma.budget.findFirst({ where: { id, userId } });
  }

  findByUserCategoryMonth(userId: string, categoryId: string, month: Date): Promise<Budget | null> {
    return this.prisma.budget.findUnique({
      where: { userId_categoryId_month: { userId, categoryId, month } },
    });
  }

  create(data: {
    userId: string;
    categoryId: string;
    month: Date;
    amount: Prisma.Decimal;
  }): Promise<Budget> {
    return this.prisma.budget.create({ data });
  }

  update(id: string, data: { amount?: Prisma.Decimal }): Promise<Budget> {
    return this.prisma.budget.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.budget.delete({ where: { id } });
  }
}
