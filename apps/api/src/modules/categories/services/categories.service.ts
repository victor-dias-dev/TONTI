import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryType, type Category } from '@prisma/client';
import { financialMonthRange } from '../../../common/dates/zoned-time';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { UsersService } from '../../users/users.service';
import type { CreateCategoryDto, UpdateCategoryDto } from '../dto/create-category.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { CategoriesRepository } from '../repositories/categories.repository';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly usersService: UsersService,
  ) {}

  async list(userId: string, type?: 'income' | 'expense'): Promise<CategoryResponseDto[]> {
    const [categories, counts] = await Promise.all([
      this.categoriesRepository.findByUser(userId, type ? this.toCategoryType(type) : undefined),
      this.monthCounts(userId),
    ]);
    return categories.map((category) => this.toResponse(category, counts.get(category.id) ?? 0));
  }

  async getById(userId: string, id: string): Promise<CategoryResponseDto> {
    const [category, counts] = await Promise.all([
      this.requireOwned(userId, id),
      this.monthCounts(userId),
    ]);
    return this.toResponse(category, counts.get(category.id) ?? 0);
  }

  async create(userId: string, dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const type = this.toCategoryType(dto.type);
    const existing = await this.categoriesRepository.findByNameAndType(
      userId,
      dto.name.trim(),
      type,
    );

    if (existing) {
      throw new AppException(
        HttpStatus.CONFLICT,
        ErrorCode.CONFLICT,
        'Já existe uma categoria com esse nome',
      );
    }

    const category = await this.categoriesRepository.create({
      userId,
      name: dto.name.trim(),
      type,
      icon: dto.icon,
      color: dto.iconBg,
    });

    return this.toResponse(category, 0);
  }

  async update(userId: string, id: string, dto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const current = await this.requireOwned(userId, id);

    if (dto.name && dto.name.trim() !== current.name) {
      const existing = await this.categoriesRepository.findByNameAndType(
        userId,
        dto.name.trim(),
        current.type,
      );
      if (existing && existing.id !== id) {
        throw new AppException(
          HttpStatus.CONFLICT,
          ErrorCode.CONFLICT,
          'Já existe uma categoria com esse nome',
        );
      }
    }

    const category = await this.categoriesRepository.update(id, {
      name: dto.name?.trim(),
      icon: dto.icon,
      color: dto.iconBg,
    });
    const counts = await this.monthCounts(userId);
    return this.toResponse(category, counts.get(category.id) ?? 0);
  }

  async remove(userId: string, id: string): Promise<void> {
    const category = await this.requireOwned(userId, id);

    if (category.isSystem) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorCode.BUSINESS_RULE,
        'Categorias padrão não podem ser excluídas',
      );
    }

    const usage = await this.categoriesRepository.countUsage(id);
    if (usage.transactions > 0 || usage.budgets > 0) {
      throw new AppException(
        HttpStatus.CONFLICT,
        ErrorCode.CONFLICT,
        'Não é possível excluir uma categoria com transações ou orçamentos',
      );
    }

    await this.categoriesRepository.delete(id);
  }

  toResponse(category: Category, transactionCount = 0): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      iconBg: category.color,
      type: category.type === CategoryType.INCOME ? 'income' : 'expense',
      isSystem: category.isSystem,
      transactionCount,
    };
  }

  private async monthCounts(userId: string): Promise<Map<string, number>> {
    const user = await this.usersService.findById(userId);
    const timeZone = user?.timezone ?? 'America/Sao_Paulo';
    const periodStartDay = user?.periodStartDay ?? 1;
    const range = financialMonthRange(new Date(), timeZone, periodStartDay);
    const rows = await this.categoriesRepository.countTransactionsInRange(
      userId,
      range.start,
      range.end,
    );
    return new Map(rows.map((row) => [row.categoryId, row.count]));
  }

  private async requireOwned(userId: string, id: string): Promise<Category> {
    const category = await this.categoriesRepository.findByIdAndUser(id, userId);
    if (!category) {
      throw new AppException(HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND, 'Categoria não encontrada');
    }
    return category;
  }

  private toCategoryType(type: 'income' | 'expense'): CategoryType {
    return type === 'income' ? CategoryType.INCOME : CategoryType.EXPENSE;
  }
}
