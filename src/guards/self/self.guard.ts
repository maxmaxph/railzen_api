import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const userIdParam = parseInt(request.params.id);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (
      (user.role && user.role.name === 'admin') ||
      user.user_id === userIdParam
    ) {
      return true;
    } else {
      throw new UnauthorizedException(
        "Vous n''êtes pas autorisés à accèder ou modifier ces infos.",
      );
    }
  }
}
