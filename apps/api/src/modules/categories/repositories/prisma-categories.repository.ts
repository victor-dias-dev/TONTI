import { Injectable } from '@nestjs/common';
import type { Category, CategoryType } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class PrismaCategoriesRepository extends CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findByUser(userId: string, type?: CategoryType): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: [{ isSystem: 'desc' }, { name: 'asc' }],
    });
  }

  findByIdAndUser(id: string, userId: string): Promise<Category | null> {
    return this.prisma.category.findFirst({ where: { id, userId } });
  }

  findByNameAndType(userId: string, name: string, type: CategoryType): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: { userId, type, name: { equals: name, mode: 'insensitive' } },
    });
  }

  create(data: {
    userId: string;
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
    isSystem?: boolean;
  }): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  update(id: string, data: { name?: string; icon?: string; color?: string }): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }

  async countUsage(id: string): Promise<{ transactions: number; budgets: number }> {
    const [transactions, budgets] = await Promise.all([
      this.prisma.transaction.count({ where: { categoryId: id } }),
      this.prisma.budget.count({ where: { categoryId: id } }),
    ]);
    return { transactions, budgets };
  }
}
