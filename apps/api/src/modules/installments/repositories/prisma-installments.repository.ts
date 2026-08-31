import { Injectable } from '@nestjs/common';
import { TransactionStatus } from '@prisma/client';
import { PrismaService } from '../../../database/prisma.service';
import { InstallmentsRepository, type InstallmentTransaction } from './installments.repository';

const include = { category: { select: { icon: true as const } } };

@Injectable()
export class PrismaInstallmentsRepository extends InstallmentsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findGrouped(userId: string): Promise<InstallmentTransaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        installmentGroupId: { not: null },
        status: { not: TransactionStatus.CANCELLED },
      },
      include,
      orderBy: { date: 'asc' },
    });
  }

  findGroup(userId: string, groupId: string): Promise<InstallmentTransaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        userId,
        installmentGroupId: groupId,
        status: { not: TransactionStatus.CANCELLED },
      },
      include,
      orderBy: { date: 'asc' },
    });
  }
}
