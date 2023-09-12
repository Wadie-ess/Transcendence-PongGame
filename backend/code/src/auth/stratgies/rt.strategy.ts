import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtConsts } from '../constants/constants';
import { Req } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayloadWRT } from '../types/JwtPaloadWRT.type';

export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStrategy.cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: JwtConsts.rt_secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  private static cookieExtractor(@Req() req: Request) {
    if (req.cookies && req.cookies['X-Refresh-Token'])
      return req.cookies['X-Refresh-Token'];
    return null;
  }
  async validate(@Req() req: Request, payload: any): Promise<JwtPayloadWRT> {
    const refreshToken = RtStrategy.cookieExtractor(req);
    return { userId: payload.sub, username: payload.username, refreshToken };
  }
}
