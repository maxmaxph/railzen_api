import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable() // Decorator indicating that this class is an injectable service
@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class RolesService {
  // Injection of the repository for the Role entity
  // Injection du dépôt (repository) pour l'entité Role
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Placeholder method to create a new role
  // Méthode de substitution pour créer un nouveau rôle
  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  // Method to retrieve all roles
  // Méthode pour récupérer tous les rôles
  async findAll() {
    return this.roleRepository.find();
  }

  // Asynchronous method to retrieve a role by its ID
  // Méthode asynchrone pour récupérer un rôle par son ID
  async findOne(id: number) {
    const found = await this.roleRepository.findOneBy({ role_id: id });
    // If the role is not found, throw an exception
    // Si le rôle n'est pas trouvé, lancez une exception
    if (!found) {
      throw new NotFoundException(`Role id $id not found`);
    }
    return found;
  }

  // Placeholder method to update a role by its ID
  // Méthode de substitution pour mettre à jour un rôle par son ID
  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  // Placeholder method to remove a role by its ID
  // Méthode de substitution pour supprimer un rôle par son ID
  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
