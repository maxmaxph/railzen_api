import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';

@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class UsersService {
  // Injection des dépôts (repositories) pour les entités User et Role
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  // Méthode asynchrone pour créer un nouvel utilisateur
  async create(createUserDto: CreateUserDto) {
    // Crée une nouvelle instance d'utilisateur à partir du DTO reçu
    const newUser = this.userRepository.create(createUserDto);

    // Recherche le rôle par défaut avec le nom 'user'
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    // Si le rôle par défaut n'est pas trouvé, lance une exception
    if (!defaultRole) {
      throw new NotFoundException('Default role not found');
    }

    // Définit la date d'inscription de l'utilisateur à la date actuelle
    newUser.date_in = new Date();

    // Attribue l'ID du rôle par défaut à l'utilisateur
    newUser.role_id = defaultRole.role_id;

    // Sauvegarde le nouvel utilisateur dans la base de données
    const user = await this.userRepository.save(newUser);

    // Retourne l'utilisateur créé
    return user;
  }

  // Méthode pour récupérer tous les utilisateurs avec leurs rôles associés.
  async findAll() {
    // Recherche de tous les utilisateurs avec leur rôle associé.
    const user = await this.userRepository.find({
      relations: ['role'],
    });
    // Renvoi de la liste des utilisateurs trouvés.
    return user;
  }

  async findOne(id: number) {
    const found = await this.userRepository.findOneBy({ user_id: id });
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return found;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.findOne(id);
    Object.assign(userToUpdate, updateUserDto);
    return this.userRepository.save(userToUpdate);
  }

  async remove(id: number) {
    const userToRemove = await this.findOne(id);
    if (!userToRemove) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(userToRemove);
  }
}
