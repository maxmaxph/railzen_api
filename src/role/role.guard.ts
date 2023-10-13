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
