<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nestbacker" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nestsponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nestsponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nestbacker)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nestsponsor)-->

Guide de Configuration

**Étape 1 : Création de la BDD RZDB**

```sql
CREATE DATABASE rzdb;
```

**Étape 2: Création des tables**

```sql
CREATE TABLE "rz_role" (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(25) NOT NULL
);

CREATE TABLE "rz_user" (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password CHAR(60) NOT NULL,
    date_in TIMESTAMP NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_rz_user_rz_role FOREIGN KEY (role_id) REFERENCES rz_role(role_id)
);

CREATE TABLE "rz_category"(
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL
);

CREATE TABLE "rz_session"(
    session_id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    duration TIME NOT NULL,
    sound_file VARCHAR(255) NOT NULL,
    date_added TIMESTAMP NOT NULL,
    category_id INT NOT NULL,
    user_id INT NOT NULL,
    CONSTRAINT fk_rz_session_rz_user FOREIGN KEY (user_id) REFERENCES rz_user(user_id),
    CONSTRAINT fk_rz_session_rz_category FOREIGN KEY (category_id) REFERENCES rz_category(category_id)
);

CREATE TABLE "rz_favorite"(
    user_id INT NOT NULL,
    session_id INT NOT NULL,
    CONSTRAINT fk_rz_favorite_rz_user FOREIGN KEY (user_id) REFERENCES rz_user(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_rz_favorite_rz_session FOREIGN KEY (session_id) REFERENCES rz_session(session_id)
);

```

j'ai ensuite inséré des lignes dans mes colones afin d'avoir des données pour effectuer mes tests à posteriori et me suis rendu compte que la valeur NOT NULL sur les date d'inscription et d'ajout de scéance ne me permettait pas d'ajouter de user et sessions sans date.
De plus j'ai ajoute une contrainte d'unicité nommée unique_favorite à la table "rz_favorite" sur les colonnes user_id et session_id.

```sql
ALTER TABLE rz_user
ALTER COLUMN date_in SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE rz_session
ALTER COLUMN date_added SET DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "rz_favorite"
ADD CONSTRAINT unique_favorite UNIQUE (user_id, session_id);

```

J'ai pu ensuite insérer mes données dans mes tables dans l'ordre suivant

```sql
INSERT INTO rz_role (name) VALUES ('user'),('admin');

INSERT INTO rz_user (first_name , last_name, email, "password" , role_id) VALUES ('Lenfant', 'Maxime', 'maxmaxph@gmail.com','azerty', '2'),
('Lobry', 'Edwige', 'edwigelobry@gmail.com', 'azerty', '1');

INSERT INTO rz_category ("name", description) VALUES ('Stressless', 'sans stress au travail c''est mieux');

INSERT INTO rz_session (title, description, duration, sound_file, category_id, user_id)
VALUES ('zen at work', 'se destresser au travail', '01:30:00', 'chemin/vers/fichier_son.mp3', 1, 2);
```

**Étape 3: Création de l’API sur VSCode**  
Création du dossier de l’APP : RAILZEN_APP  
Ouvrir ce dossier sur VSCode via git bash:

```bash
code .
```

Ouvrir un terminal et saisir les commandes :

initialisation du projet nest

```bash
nest new railzen_api
```

Initialisation de git

```bash
git init
```

```bash
cd railzen_api
```

premier commit initialisation

```bash
git add . && git commit -m"0-Initialisation du projet"
```

Initialise un nouveau dépôt Git dans le répertoire actuel,
nodemon : Redémarre automatiquement le serveur lors de modifications du code.
ts-node : Exécute directement le code TypeScript sans transpilation préalable.
typescript : Le compilateur pour transpiler le code TypeScript en JavaScript.
@types/express : Fournit des définitions de types pour utiliser Express.js avec TypeScript.

```bash
npm i -D nodemon ts-node typescript @types/express
```

Installation du module @nestjs/config pour NestJS.

```bash
npm i --save @nestjs/config
```

Installation des trois paquets nécessaires pour intégrer TypeORM avec NestJS et pour travailler avec PostgreSQL.

```bash
npm i --save @nestjs/typeorm typeorm pg
```

Installe deux paquets pour la validation et la transformation des données basées sur des classes dans une application TypeScript ou NestJS.

```bash
npm i --save class-validator class-transformer
```

Installe le module @nestjs/swagger pour NestJS.

```bash
npm i --save @nestjs/swagger
```

**Étape 4 : Création du fichier .env (et .env.template)**  
A la source du projet creation d'un .env pour définir les détails de connexion à votre base de données PostgreSQL.

```sql
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
PORT=
MODE=
JWT_SECRET=
```

Ne pas oublier de l'indiquer dans le .gitignore

**Étape 5 : Je push mon projet vers un repo github**

```bash
git remote add origin https://github.com/maxmaxph/railzen_api.git
git branch -M main
git push -u origin main
```

**Étape 6 : configuration prefixe des routes, validationpipe, swagger & cors**  
app.module.ts

```javascript
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
```

main.ts

```javascript
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

  // Démarre l'application pour écouter sur le port 3000
  await app.listen(3000);
}

bootstrap();
```

**Étape 7 : Creation et gestion des ressources**  
j'utiliserai le pluriel de mes noms de tables (convention courante en RESTful API design)

```bash
nest generate res users
nest generate res roles
nest generate res sessions
nest generate res favorites
nest generate res categories
```

les opérations de CRUD vont etre générés automatiquements pour chaques ressources.  
**Étape 8 : ajustement des entities**  
 création des différentes entitées corrspondant aux diferentes tables et colonnes de la bdd ainsi que les relations et ajout à l'app.module.ts

```javascript
entities: [Session, Role, User, Favorite, Category],
```

**Étape 9 : creation des create.dto**
Création des create.dto pour les ressources users, sessions et catégories. Ce sont les seules sur lequelles nous allons appliquer le CRUD
exemple du creat-user.dto avec ses class-validator(une bibliothèque qui permet de valider des objets en fonction de certaines règles) et decoration pour documenter avec swagger ( indique à Swagger qu’il peut l’inclure et la décrire dans la documentation de l’API).

```javascript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  first_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  last_name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @ApiProperty()
  @IsString()
  @MaxLength(60)
  @IsNotEmpty()
  password: string;
}
```

**Étape 10 : creation des methodes du CRUD dans les services des ressources**
exemple avec le usersService:

```javascript
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

```

cela m'a permis de me rendre compte que j'avais oublié une propriété "role_id" dans mon entitée User

```javascript
@Column({ type: 'int', nullable: false })
role_id: number;
```

**Étape 11 : Test de mes requetes**
Je peux désormais tester mes requêtes avec swagger qui fournit une interface via l'url locale: http://localhost:3000/api ainsi qu'avec le logiciel Postman.

**Étape 12: gestion de l'autentification et autorisation**

Création du module auth et mise en place ainsi qu'installation de:

- bcrypt pour hasher le mot de passe et ses types.
- Passeport et JWT pour nestjs
- le package le package passport-jwt et ses types

```bash
nest g res auth
npm i bcrypt
npm i --save-dev @types/bcrypt
npm i @nestjs/passport @nestjs/jwt
npm i passport-jwt
npm i --save-dev @types/passport-jwt
```

et codage de authService, authController, et CreateAthDto pour les methodes register et login:

```javascript
 async register(createAuthDto: CreateAuthDto) {
    const { first_name, last_name, email, password } = createAuthDto;

    // Génération d'un "salt" pour le hashage du mot de passe
    const salt = await bcrypt.genSalt();
    // Hashage du mot de passe avec le "salt"
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création d'une nouvelle entité User avec les données fournies
    const user = this.userRepository.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });
    const defaultRole = await this.roleRepository.findOne({
      where: { name: 'user' },
    }); // SELECT * FROM role WHERE role = 'user'
    if (!defaultRole) {
      throw new NotFoundException('Default role not found');
    }
    user.date_in = new Date(); // set date_in
    user.role_id = defaultRole.role_id; // set default role

    try {
      // Tentative d'enregistrement du nouvel utilisateur dans la base de données
      const createdUser = await this.userRepository.save(user);
      // Suppression du mot de passe du retour pour des raisons de sécurité
      delete createdUser.password;
      return createdUser;
    } catch (error) {
      // Si l'email existe déjà dans la base de données (erreur 23505)
      if (error.code === '23505') {
        throw new ConflictException('email already exists');
      } else {
        // Si une autre erreur se produit
        throw new InternalServerErrorException();
      }
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userId = user.user_id;
    const roleId = user.role_id;
    const roleName = user.role.name; // Récupérez le nom du rôle depuis l'entité User

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email, userId, roleId, roleName }; // Ajoute email, userId, roleId, roleName dans le payload du token
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Credentials not found');
    }
  }
}

```

ainsi que pour l'autorisation jwt.strategy et son decorateur:

```javascript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // IMPORTANT IL FAUT GARDER CE NOM DE METHODE
  async validate(payload: any): Promise<User> {
    console.log('validate');
    const { email } = payload;

    // Joignez le rôle lors de la récupération de l'utilisateur
    const user: User = await this.userRepository.findOne({
      where: { email },
      relations: ['role'], // Ajoutez cette ligne pour joindre le rôle
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }
}

```

```javascript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user; // NE PAS RENOMMER
		// c'est toujours la propriété user de req que l'on retourne
  },
);
```

et pouvoir proteger et gérer l'acces aux methode qu'aux utilisateurs connectés.

**Étape 13: creation d'un roleGuard**

Afin de n'autoriser l'accès à certaines méthode qu'aux user dont le token est valide et dont le role est"admin"

Je génère un roleGard:

```bash
nest g guard role
```

Et code la méthode canActivate:

```javascript
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly roleName: string) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException("Vous n'êtes pas connecté");
    }

    // Vérifiez si l'utilisateur a une propriété 'role' et si cette propriété a une sous-propriété 'name'
    if (!user.role || !user.role.name || user.role.name !== this.roleName) {
      throw new ForbiddenException("Vous n'avez pas les droits nécessaires");
    }

    return true;
  }
}

```

que j'utlise dans mes controller sur les méthode que je ne veux rendre accessisbles qu'aux admins:  
exemple sur le userController

```javascript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role/role.guard';
@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'), new RoleGuard('admin'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

```

Si je ne suis pas loggé en tant qu'admin, aucune requete n'aboutira.
