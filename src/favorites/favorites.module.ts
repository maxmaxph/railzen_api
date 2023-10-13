import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])], // Importation du module TypeORM pour l'entité Favorite
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
