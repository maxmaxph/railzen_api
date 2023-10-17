import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly storagePath = './uploads'; // Chemin de stockage des fichiers

  constructor() {
    this.initializeStorageDirectory();
  }

  // Vérifier si le répertoire de stockage existe, sinon le créer
  private initializeStorageDirectory() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath);
    }
  }

  // Méthode pour sauvegarder un fichier
  async saveFile(file: Express.Multer.File): Promise<string> {
    const uniqueFileName = this.generateUniqueFileName(file.originalname);
    const filePath = path.join(this.storagePath, uniqueFileName);

    await fs.promises.writeFile(filePath, file.buffer);

    // Retourne l'URL du fichier sauvegardé
    return `/uploads/${uniqueFileName}`;
  }

  // Générer un nom de fichier unique pour éviter les collisions
  private generateUniqueFileName(originalFileName: string): string {
    const timestamp = new Date().getTime();
    const randomPart = Math.random().toString(36).substring(2, 8);
    const fileExtension = path.extname(originalFileName);

    return `${timestamp}_${randomPart}${fileExtension}`;
  }
}
