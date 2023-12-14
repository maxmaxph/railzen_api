import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Définit un préfixe global pour toutes les routes de l'API
  app.setGlobalPrefix(`api`);

  // Utilise un pipe global pour valider les données entrantes selon les décorateurs de classe DTO
  app.useGlobalPipes(new ValidationPipe());

  // Active CORS pour permettre aux requêtes de différents domaines d'accéder à l'API
  app.enableCors();

  // Configuration module Swagger (doc API)
  const config = new DocumentBuilder()
    .setTitle('RAIL ZEN API') // Titre de la documentation
    .setDescription('Meditation pour les cheminots de la SNCF') // Description de l'API
    .setVersion('1.0') // Version de l'API
    .addTag('railzen') // Ajoute une étiquette pour regrouper les routes/endpoints
    .build();

  // Crée un document Swagger basé sur les configurations et l'application NestJS
  const document = SwaggerModule.createDocument(app, config);

  // Configure l'application pour utiliser Swagger sur le chemin '/api'
  SwaggerModule.setup('api', app, document);

  const corsOptions: CorsOptions = {
    origin: 'https://maxime-lenfant.fr',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  };
  app.enableCors(corsOptions);
  // Démarre l'application pour écouter sur le port 3000
  await app.listen(3000);
}

bootstrap();
