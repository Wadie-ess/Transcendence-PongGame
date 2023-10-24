import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConsts } from '../constants/constants';
import { Request } from 'express';
import { Inject, Req } from '@nestjs/common';
import { JwtPayload } from '../types';
import { UsersService } from 'src/users/users.service';

export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@Inject(UsersService) private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AtStrategy.cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: JwtConsts.at_secret,
      ignoreExpiration: false,
    });
  }

  private static cookieExtractor(@Req() req: Request) {
    if (req.cookies && req.cookies['X-Access-Token'])
      return req.cookies['X-Access-Token'];
    return null;
  }

  async validate(payload: any): Promise<JwtPayload> {
    const curruser = await this.userService.getUserById(payload.sub);
    return { ...curruser, username: payload.username };
  }
}
