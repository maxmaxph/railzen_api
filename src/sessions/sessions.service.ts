import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Category } from 'src/categories/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable() // Decorator indicating that this class is an injectable service
@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class SessionsService {
  // Injection of repositories for Session and Category entities
  // Injection des dépôts (repositories) pour les entités Session et Category
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Asynchronous method to create a new session
  // Méthode asynchrone pour créer une nouvelle session
  async create(createSessionDto: CreateSessionDto, user: any) {
    const session = new Session();
    Object.assign(session, createSessionDto);
    session.user = user; // Associate the admin to the session
    // Associez l'administrateur à la session
    return this.sessionRepository.save(session);
  }

  // Method to retrieve all sessions
  // Méthode pour récupérer toutes les sessions
  async findAll() {
    return await this.sessionRepository.find();
  }

  // Asynchronous method to retrieve a session by its ID
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

  // Asynchronous method to update a session by its ID
  // Méthode asynchrone pour mettre à jour une session par son ID
  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const sessionToUpdate = await this.findOne(id);
    if (!sessionToUpdate) {
      throw new NotFoundException(`session #${id} not found`);
    }
    Object.assign(sessionToUpdate, updateSessionDto);

    return this.sessionRepository.save(sessionToUpdate);
  }

  // Asynchronous method to remove a session by its ID
  // Méthode asynchrone pour supprimer une session par son ID
  async remove(id: number) {
    const sessionToRemove = await this.findOne(id);
    if (!sessionToRemove) {
      throw new NotFoundException(`session #${id} not found`);
    }
    return this.sessionRepository.remove(sessionToRemove);
  }
}
