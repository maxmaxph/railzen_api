import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Importation du module TypeORM pour l'entité Category
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
