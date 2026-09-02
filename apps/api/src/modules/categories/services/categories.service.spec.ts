import { HttpStatus } from '@nestjs/common';
import { CategoryType, type Category } from '@prisma/client';
import { AppException } from '../../../common/errors/app.exception';
import { ErrorCode } from '../../../common/errors/error-codes';
import { CategoriesRepository } from '../repositories/categories.repository';
import { CategoriesService } from './categories.service';

const category: Category = {
  id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  userId: '11111111-1111-1111-1111-111111111111',
  name: 'Alimentação',
  type: CategoryType.EXPENSE,
  icon: 'food',
  color: 'rgba(255, 218, 214, 0.2)',
  isSystem: true,
  createdAt: new Date('2026-08-01T00:00:00.000Z'),
  updatedAt: new Date('2026-08-01T00:00:00.000Z'),
};

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: {
    findByUser: jest.Mock;
    findByIdAndUser: jest.Mock;
    findByNameAndType: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    countUsage: jest.Mock;
    countTransactionsInRange: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findByUser: jest.fn(),
      findByIdAndUser: jest.fn(),
      findByNameAndType: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      countUsage: jest.fn(),
      countTransactionsInRange: jest.fn().mockResolvedValue([]),
    };
    const usersService = {
      findById: jest.fn().mockResolvedValue({
        timezone: 'America/Sao_Paulo',
        periodStartDay: 1,
      }),
    };
    service = new CategoriesService(
      repository as unknown as CategoriesRepository,
      usersService as never,
    );
  });

  it('maps color to iconBg for the mobile contract', async () => {
    repository.findByUser.mockResolvedValue([category]);

    const result = await service.list(category.userId);

    expect(result).toEqual([
      {
        id: category.id,
        name: 'Alimentação',
        icon: 'food',
        iconBg: category.color,
        type: 'expense',
        isSystem: true,
        transactionCount: 0,
      },
    ]);
  });

  it('rejects duplicate names for the same user and type', async () => {
    repository.findByNameAndType.mockResolvedValue(category);

    try {
      await service.create(category.userId, {
        name: 'Alimentação',
        type: 'expense',
        icon: 'food',
        iconBg: category.color,
      });
      fail('expected create to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).code).toBe(ErrorCode.CONFLICT);
    }
  });

  it('hides another user category as not found', async () => {
    repository.findByIdAndUser.mockResolvedValue(null);

    try {
      await service.getById('other-user', category.id);
      fail('expected getById to throw');
    } catch (error) {
      expect(error).toBeInstanceOf(AppException);
      expect((error as AppException).getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('does not delete system categories', async () => {
    repository.findByIdAndUser.mockResolvedValue(category);

    try {
      await service.remove(category.userId, category.id);
      fail('expected remove to throw');
    } catch (error) {
      expect((error as AppException).code).toBe(ErrorCode.BUSINESS_RULE);
      expect(repository.delete).not.toHaveBeenCalled();
    }
  });
});
