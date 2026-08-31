import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './controllers/categories.controller';
import { PrismaCategoriesRepository } from './repositories/prisma-categories.repository';
import { CategoriesRepository } from './repositories/categories.repository';
import { CategoriesService } from './services/categories.service';

@Module({
  imports: [AuthModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    { provide: CategoriesRepository, useClass: PrismaCategoriesRepository },
  ],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
