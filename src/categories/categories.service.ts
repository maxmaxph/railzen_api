import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

// Decorator indicating that this class is an injectable service
// Décorateur indiquant que cette classe est un service injectable
@Injectable()
export class CategoriesService {
  // Injection of the repository for the Category entity
  // Injection du dépôt (repository) pour l'entité Category
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Asynchronous method to create a new category
  // Méthode asynchrone pour créer une nouvelle catégorie
  async create(createCategoryDto: CreateCategoryDto) {
    const category: Category = new Category();
    Object.assign(category, createCategoryDto);
    // Save the new category in the database
    // Sauvegardez la nouvelle catégorie dans la base de données
    return this.categoryRepository.save(category);
  }

  // Method to retrieve all categories
  // Méthode pour récupérer toutes les catégories
  async findAll() {
    return await this.categoryRepository.find();
  }

  // Asynchronous method to retrieve a category by its ID
  // Méthode asynchrone pour récupérer une catégorie par son ID
  async findOne(id: number) {
    const found = await this.categoryRepository.findOneBy({ category_id: id });
    // If the category is not found, throw an exception
    // Si la catégorie n'est pas trouvée, lancez une exception
    if (!found) {
      throw new NotFoundException(`Category #${id}  not found`);
    }
    return found;
  }

  // Asynchronous method to update a category by its ID
  // Méthode asynchrone pour mettre à jour une catégorie par son ID
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const categoryToUpdate = await this.findOne(id);
    if (!categoryToUpdate) {
      throw new NotFoundException(`Category #${id}  not found`);
    }
    Object.assign(categoryToUpdate, updateCategoryDto);

    // Save the updated category in the database
    // Sauvegardez la catégorie mise à jour dans la base de données
    return this.categoryRepository.save(categoryToUpdate);
  }

  // Asynchronous method to remove a category by its ID
  // Méthode asynchrone pour supprimer une catégorie par son ID
  async remove(id: number) {
    const categoryToRemove = await this.findOne(id);
    if (!categoryToRemove) {
      throw new NotFoundException(`category #${id} not found`);
    }
    // Remove the category from the database
    // Supprimez la catégorie de la base de données
    return this.categoryRepository.remove(categoryToRemove);
  }
}
