import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

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
      throw new NotFoundException('Rôle par défaut non trouvé');
    }
    user.date_in = new Date(); // set date_in
    user.role_id = defaultRole.role_id; // set default role

    try {
      // Tentative d'enregistrement du nouvel utilisateur dans la base de données
      const createdUser = await this.userRepository.save(user);

      // Create a payload for the JWT token
      const payload = {
        email: user.email,
        userId: user.user_id,
        roleId: user.role_id,
        roleName: 'user',
      };

      const accessToken = this.jwtService.sign(payload);

      // Suppression du mot de passe du retour pour des raisons de sécurité
      delete createdUser.password;
      return { createdUser, accessToken };
    } catch (error) {
      // Si l'email existe déjà dans la base de données (erreur 23505)
      if (error.code === '23505') {
        throw new ConflictException('Adresse déjà enregistrée');
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
      throw new UnauthorizedException('Utilisateur introuvable');
    }

    const userId = user.user_id;
    const roleId = user.role_id;
    const roleName = user.role.name; // Récupére le nom du rôle depuis l'entité User

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email, userId, roleId, roleName };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Mot de passe érroné');
    }
  }
}
