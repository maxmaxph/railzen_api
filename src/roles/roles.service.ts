import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable() // Décorateur indiquant que cette classe est un service injectable
export class RolesService {
  // Injection du dépôt (repository) pour l'entité Role
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Méthode pour récupérer tous les rôles
  async findAll() {
    return this.roleRepository.find();
  }

  // Méthode asynchrone pour récupérer un rôle par son ID
  async findOne(id: number) {
    const found = await this.roleRepository.findOneBy({ role_id: id });

    // Si le rôle n'est pas trouvé, lancez une exception
    if (!found) {
      throw new NotFoundException(`Role id $id not found`);
    }
    return found;
  }
}
