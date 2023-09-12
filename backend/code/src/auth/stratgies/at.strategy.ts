import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConsts } from '../constants/constants';
import { Request } from 'express';
import { Req } from '@nestjs/common';
import { JwtPayload } from '../types';

export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
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
    return { userId: payload.sub, username: payload.username };
  }
}
