import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RedisService } from '../redis/redis.service';

export type DependencyStatus = 'up' | 'down';

export interface HealthResult {
  status: 'ok' | 'error';
  database: DependencyStatus;
  redis: DependencyStatus;
}

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthResult> {
    const [database, redis] = await Promise.all([this.checkDatabase(), this.checkRedis()]);
    const status = database === 'up' && redis === 'up' ? 'ok' : 'error';
    return { status, database, redis };
  }

  private async checkDatabase(): Promise<DependencyStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'down';
    }
  }

  private async checkRedis(): Promise<DependencyStatus> {
    return (await this.redis.ping()) ? 'up' : 'down';
  }
}
