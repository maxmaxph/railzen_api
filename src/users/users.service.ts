import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import jwt from 'jsonwebtoken';
@Injectable() // Decorator indicating that this class is an injectable service
@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class UsersService {
  // Injection of repositories for User and Role entities
  // Injection des dépôts (repositories) pour les entités User et Role
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  // Asynchronous method to create a new user
  // Méthode asynchrone pour créer un nouvel utilisateur
  async create(createUserDto: CreateUserDto) {
    // Create a new user instance from the received DTO
    // Crée une nouvelle instance d'utilisateur à partir du DTO reçu
    const newUser = this.userRepository.create(createUserDto);

    // Search for the default role with the name 'user'
    // Recherche le rôle par défaut avec le nom 'user'
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    });

    // If the default role is not found, throw an exception
    // Si le rôle par défaut n'est pas trouvé, lance une exception
    if (!defaultRole) {
      throw new NotFoundException('Default role not found');
    }

    // Set the user's registration date to the current date
    // Définit la date d'inscription de l'utilisateur à la date actuelle
    newUser.date_in = new Date();

    // Assign the ID of the default role to the user
    // Attribue l'ID du rôle par défaut à l'utilisateur
    newUser.role_id = defaultRole.role_id;

    // Save the new user in the database
    // Sauvegarde le nouvel utilisateur dans la base de données
    const user = await this.userRepository.save(newUser);

    // Return the created user
    // Retourne l'utilisateur créé
    return user;
  }

  // Method to retrieve all users with their associated roles.
  // Méthode pour récupérer tous les utilisateurs avec leurs rôles associés.
  async findAll() {
    // Search for all users with their associated role.
    // Recherche de tous les utilisateurs avec leur rôle associé.
    const user = await this.userRepository.find({
      relations: ['role'],
    });
    // Return the list of found users.
    // Renvoi de la liste des utilisateurs trouvés.
    return user;
  }

  // Asynchronous method to retrieve a user by its ID
  // Méthode asynchrone pour récupérer un utilisateur par son ID
  async findOne(id: number) {
    // Search for the user by its ID
    // Recherche de l'utilisateur par son ID
    const found = await this.userRepository.findOneBy({ user_id: id });
    // If the user is not found, throw an exception
    // Si l'utilisateur n'est pas trouvé, lance une exception
    if (!found) {
      throw new NotFoundException('User not found');
    }
    return found;
  }

  // Asynchronous method to update a user by its ID
  // Méthode asynchrone pour mettre à jour un utilisateur par son ID
  async update(id: number, updateUserDto: UpdateUserDto) {
    const userToUpdate = await this.userRepository.findOne({
      where: { user_id: id },
      relations: ['role'],
    });

    if (!userToUpdate) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.assign(userToUpdate, updateUserDto);

    // Si un role_id est fourni, mettez à jour l'objet role associé
    if (updateUserDto.role_id) {
      const newRole = await this.roleRepository.findOneBy({
        role_id: updateUserDto.role_id,
      });
      if (newRole) {
        userToUpdate.role = newRole;
      } else {
        throw new NotFoundException(
          `Role with id ${updateUserDto.role_id} not found`,
        );
      }
    }

    await this.userRepository.save(userToUpdate);

    return userToUpdate;
  }

  // Asynchronous method to remove a user by its ID
  // Méthode asynchrone pour supprimer un utilisateur par son ID
  async remove(id: number) {
    const userToRemove = await this.findOne(id);
    if (!userToRemove) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(userToRemove);
  }

  async checkToken(token: string) {
    console.log('je suis dans checkToken : ', token);

    return new Promise(async (resolve, reject) => {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as any; // Vérifie le token et le décode

        // Assurez-vous que votre token contient une clé `id` ou similaire avec l'ID de l'utilisateur
        const userId = decodedToken.userId;

        if (!userId) {
          reject("Le token ne contient pas d'ID utilisateur");
          return;
        }

        const user = await this.findOne(userId);
        if (!user) {
          reject("Le compte n'existe pas");
          return;
        }

        resolve(true); // Le token est valide et l'utilisateur n'est pas supprimé
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          // Si le token a expiré
          reject('Token has expired');
        } else {
          reject('Token is invalid'); // Le token est invalide pour une autre raison
        }
      }
    });
  }
}
