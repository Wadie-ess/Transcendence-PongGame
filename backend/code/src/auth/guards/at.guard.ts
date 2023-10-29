import {
  ExecutionContext,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.tfaEnabled) {
      if (!user.tfaStatus) throw new HttpException('la7g inak', 403);
    }
    if (!user.profileFinished)
      throw new HttpException('Please complete your profile', 403);
    return user;
  }
}
