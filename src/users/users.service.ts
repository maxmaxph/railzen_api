import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class UsersService {
  // Injection des dépôts (repositories) pour les entités User et Role
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
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
    // Create a payload for the JWT token
    const payload = {
      email: user.email,
      userId: user.user_id,
      roleId: user.role_id,
      roleName: 'user',
    };

    //Signature du playload pour créer le JWT
    const token = this.jwtService.sign(payload);

    // Return the created user and the token
    return { user, token };
  }

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

  async updatePassword(userId: number, newPassword: string): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepository.update(userId, { password: hashedPassword });
    return this.userRepository.findOne({ where: { user_id: userId } });
  }
}
