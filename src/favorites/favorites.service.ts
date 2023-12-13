import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable() // Decorator indicating that this class is an injectable service
@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class FavoritesService {
  // Injection du dépôt (repository) pour l'entité Favorite
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  // Méthode asynchrone pour ajouter une session aux favoris
  async addToFavorites(userId: number, sessionId: number): Promise<Favorite> {
    try {
      const existingFavorite = await this.favoriteRepository.findOne({
        where: {
          user_id: userId,
          session_id: sessionId,
        },
      });

      if (existingFavorite) {
        throw new Error('Séance déjà ajoutée');
      }

      const favorite = this.favoriteRepository.create({
        user_id: userId,
        session_id: sessionId,
      });

      return await this.favoriteRepository.save(favorite);
    } catch (error) {
      // Gérez ici l'erreur ou propagez une exception personnalisée
      throw new Error('Erreur pendant ajout aux favoris ' + error.message);
    }
  }

  // Méthode pour récupérer tous les favoris
  async findAll() {
    try {
      // Tentative de récupération des favoris
      return await this.favoriteRepository.find();
    } catch (error) {
      // Gestion de l'erreur, par exemple, en lançant une exception personnalisée
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la récupération des favoris',
      );
    }
  }

  // Méthode asynchrone pour récupérer les favoris par ID utilisateur
  async findFavoritesByUserId(userId: number): Promise<Favorite[]> {
    try {
      return await this.favoriteRepository.find({
        where: {
          user_id: userId,
        },
      });
    } catch (error) {
      // Gestion de l'erreur, par exemple, en lançant une exception personnalisée
      throw new InternalServerErrorException(
        "Erreur lors de la récupération des favoris pour l'utilisateur.",
      );
    }
  }

  // Méthode asynchrone pour supprimer un favori par ID utilisateur et ID session
  async removeFavoriteByUserIdAndSessionId(
    userId: number,
    sessionId: number,
  ): Promise<void> {
    try {
      const favorite = await this.favoriteRepository.findOne({
        where: {
          user_id: userId,
          session_id: sessionId,
        },
      });

      if (!favorite) {
        throw new Error('Favorite not found');
      }

      await this.favoriteRepository.remove(favorite);
    } catch (error) {
      // Gérez l'erreur ou propagez une exception personnalisée
      throw new Error('Error removing favorite: ' + error.message);
    }
  }
}
