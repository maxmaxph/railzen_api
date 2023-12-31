import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Category } from 'src/categories/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class SessionsService {
  // Injection des dépôts (repositories) pour les entités Session et Category
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Méthode asynchrone pour créer une nouvelle session
  async create(createSessionDto: CreateSessionDto, user: any) {
    const session = new Session();
    Object.assign(session, createSessionDto);
    session.user = user;

    // Créer une référence à une entité Category sans la charger depuis la base de données
    session.category = this.categoryRepository.create({
      category_id: createSessionDto.category_id,
    });

    return this.sessionRepository.save(session);
  }

  // Méthode pour récupérer toutes les sessions
  async findAll() {
    return await this.sessionRepository.find();
  }

  // Méthode asynchrone pour récupérer une session par son ID
  async findOne(id: number) {
    const found = await this.sessionRepository.findOneBy({ session_id: id });
    // If the session is not found, throw an exception
    // Si la session n'est pas trouvée, lance une exception
    if (!found) {
      throw new NotFoundException(`session #${id} not found`);
    }
    return found;
  }

  // Méthode asynchrone pour trouver les sessions par leurs catégories
  async findSessionsByCategory(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      category_id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category #${categoryId} not found`);
    }
    return this.sessionRepository.find({
      where: { category: category },
      relations: ['category'],
    });
  }

  // Méthode asynchrone pour mettre à jour une session par son ID
  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const sessionToUpdate = await this.findOne(id);
    if (!sessionToUpdate) {
      throw new NotFoundException(`session #${id} not found`);
    }
    Object.assign(sessionToUpdate, updateSessionDto);

    return this.sessionRepository.save(sessionToUpdate);
  }

  // Méthode asynchrone pour supprimer une session par son ID
  async remove(id: number) {
    const sessionToRemove = await this.findOne(id);
    if (!sessionToRemove) {
      throw new NotFoundException(`session #${id} not found`);
    }
    return this.sessionRepository.remove(sessionToRemove);
  }
}
