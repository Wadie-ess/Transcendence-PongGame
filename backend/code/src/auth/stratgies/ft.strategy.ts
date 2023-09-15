import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { JwtUtils } from '../utils/jwt_utils/jwt_utils';
import { v4 as uuidv4 } from 'uuid';
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
        user.id,
      );
      await this.jwtUtils.updateRefreshedHash(user.id, tokens.refresh_token);
      res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
      res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
      return cb(null, profile);
    }

    const new_user = await this.usersService.createUser({
      intraId: profile.id,
      intraUsername: profile.username,
      id: uuidv4(),
    });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.intraUsername,
      new_user.id,
    );
    await this.jwtUtils.updateRefreshedHash(new_user.id, tokens.refresh_token);
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
    return cb(null, profile);
  }
}
