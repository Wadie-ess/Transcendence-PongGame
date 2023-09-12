import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FtOauthGuard extends AuthGuard('42') {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    //output request url
    console.log(req.url);
    const res = context.switchToHttp().getResponse();
    req.res = res;
    return super.canActivate(context);
  }
}
