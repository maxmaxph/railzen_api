import { Injectable } from '@nestjs/common';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';

@Injectable() // Decorator indicating that this class is an injectable service
@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class FavoritesService {
  // Injection of the repository for the Favorite entity
  // Injection du dépôt (repository) pour l'entité Favorite
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  // Asynchronous method to add a session to favorites
  // Méthode asynchrone pour ajouter une session aux favoris
  async addToFavorites(userId: number, sessionId: number): Promise<Favorite> {
    // First, check if the entry already exists
    // Vérifiez d'abord si l'entrée existe déjà
    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user_id: userId,
        session_id: sessionId,
      },
    });

    // If the session is already in favorites, throw an error
    // Si la session est déjà dans les favoris, lancez une erreur
    if (existingFavorite) {
      throw new Error('Session already added to favorites');
    }

    // Create a new favorite entry
    // Créez une nouvelle entrée favorite
    const favorite = this.favoriteRepository.create({
      user_id: userId,
      session_id: sessionId,
    });

    // Save the favorite entry in the database
    // Sauvegardez l'entrée favorite dans la base de données
    return this.favoriteRepository.save(favorite);
  }

  // Method to retrieve all favorites
  // Méthode pour récupérer tous les favoris
  async findAll() {
    return this.favoriteRepository.find();
  }

  // Asynchronous method to retrieve favorites by user ID
  // Méthode asynchrone pour récupérer les favoris par ID utilisateur
  async findFavoritesByUserId(userId: number): Promise<Favorite[]> {
    return this.favoriteRepository.find({
      where: {
        user_id: userId,
      },
    });
  }

  // Placeholder method to update a favorite by its ID
  // Méthode de substitution pour mettre à jour un favori par son ID
  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  // Asynchronous method to remove a favorite by user ID and session ID
  // Méthode asynchrone pour supprimer un favori par ID utilisateur et ID session
  async removeFavoriteByUserIdAndSessionId(
    userId: number,
    sessionId: number,
  ): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user_id: userId,
        session_id: sessionId,
      },
    });

    // If the favorite is not found, throw an error
    // Si le favori n'est pas trouvé, lancez une erreur
    if (!favorite) {
      throw new Error('Favorite not found');
    }

    // Remove the favorite from the database
    // Supprimez le favori de la base de données
    await this.favoriteRepository.remove(favorite);
  }
}
