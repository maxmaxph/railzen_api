import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Category } from 'src/categories/entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Méthode pour créer une nouvelle session
  // Method to create a new session
  async create(createSessionDto: CreateSessionDto, user: User) {
    const session = new Session();
    Object.assign(session, createSessionDto);
    session.user = user;

    return this.sessionRepository.save(session);
  }

  // Méthode pour récupérer toutes les sessions
  // Method to retrieve all sessions
  async findAll() {
    return await this.sessionRepository.find();
  }

  // Méthode asynchrone pour récupérer une session par son ID
  // Asynchronous method to retrieve a session by its ID
  async findOne(id: number) {
    const found = await this.sessionRepository.findOneBy({ session_id: id });
    // If the session is not found, throw an exception
    // Si la session n'est pas trouvée, lancez une exception
    if (!found) {
      throw new NotFoundException(`session #${id}  not found`);
    }
    return found;
  }

  // Méthode asynchrone pour mettre à jour une session par son ID
  // Asynchronous method to update a session by its ID
  async update(id: number, updateSessionDto: UpdateSessionDto) {
    const sessionToUpdate = await this.findOne(id);
    Object.assign(sessionToUpdate, updateSessionDto);
    return this.sessionRepository.save(sessionToUpdate);
  }

  // Méthode asynchrone pour supprimer une session par son ID
  // Asynchronous method to remove a session by its ID
  async remove(id: number) {
    const sessionToRemove = await this.findOne(id);
    return this.sessionRepository.remove(sessionToRemove);
  }

  // Méthode privée pour sauvegarder un fichier MP3
  // Private method to save an MP3 file
  private async saveMP3File(fileBuffer: Buffer): Promise<string> {
    const uniqueFileName = this.generateUniqueFileName('mp3');
    const filePath = path.join('./uploads', uniqueFileName);

    await fs.promises.writeFile(filePath, fileBuffer);

    return `/uploads/${uniqueFileName}`;
  }

  // Méthode privée pour générer un nom de fichier unique
  // Private method to generate a unique file name
  private generateUniqueFileName(extension: string): string {
    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${timestamp}_${randomPart}.${extension}`;
  }
}
