import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Importe le module de configuration pour gérer les variables d'environnement
    ConfigModule.forRoot({ envFilePath: [`.env`] }),

    // Importe le module TypeORM pour la connexion à la base de données
    TypeOrmModule.forRoot({
      type: 'postgres', // Spécifie le type de base de données (PostgreSQL)
      host: 'localhost', // Adresse de l'hôte de la base de données
      port: +process.env.POSTGRES_PORT, // Port de la base de données (converti en nombre)
      username: process.env.POSTGRES_USER, // Nom d'utilisateur pour la connexion à la base de données
      password: process.env.POSTGRES_PASSWORD, // Mot de passe pour la connexion à la base de données
      database: process.env.POSTGRES_DATABASE, // Nom de la base de données
      synchronize: false, // Désactive la synchronisation automatique du schéma de la base de données
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
