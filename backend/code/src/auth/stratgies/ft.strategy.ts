import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { JwtUtils } from '../utils/jwt_utils/jwt_utils';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private jwtUtils: JwtUtils,
    private usersService: UsersService,
  ) {
    super({
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_CALLBACK_URL,
      passReqToCallback: true,
    });
  }

  async validate(
    req: any,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    const res = req.res;

    const user = await this.usersService.getUserByIntraId(profile.id);
    if (user) {
      const tokens = await this.jwtUtils.generateTokens(
        user.intraUsername,
        user.userId,
      );
      await this.jwtUtils.updateRefreshedHash(
        user.userId,
        tokens.refresh_token,
      );
      res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
      res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
      return cb(null, profile);
    }

    const new_user = await this.usersService.createUser({
      intraId: profile.userId,
      intraUsername: profile.username,
    });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.intraUsername,
      new_user.userId,
    );
    await this.jwtUtils.updateRefreshedHash(
      new_user.userId,
      tokens.refresh_token,
    );
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
    return cb(null, profile);
  }
}
