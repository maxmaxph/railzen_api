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

Étape 1 : Création de la BDD RZDB

```sql
CREATE DATABASE rzdb;
```

Étape 2: Création des tables

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

Étape 3: Création de l’API sur VSCode
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
