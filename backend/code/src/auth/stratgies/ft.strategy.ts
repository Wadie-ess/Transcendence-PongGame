import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { JwtUtils } from '../utils/jwt_utils/jwt_utils';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as crypto from 'crypto';
import { Response } from 'express';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private jwtUtils: JwtUtils,
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
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
    const res: Response = req.res;

    const user = await this.usersService.getUserByIntraId(profile.id);
    if (user) {
      if (user.tfaEnabled) {
        const tfaToken = crypto.randomBytes(20).toString('hex');
        await this.usersService.updateUser(user.userId, { tfaToken });
        res.redirect(process.env.FRONT_URL + '/tfa/' + tfaToken);
        return cb(null, profile);
      }

      const tokens = await this.jwtUtils.generateTokens(
        user.email,
        user.userId,
      );
      await this.jwtUtils.updateRefreshedHash(
        user.userId,
        tokens.refresh_token,
      );
      console.log(tokens);
      res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
      res.cookie('X-Refresh-Token', tokens.refresh_token, {
        httpOnly: true,
        path: '/auth',
      });
      res.redirect(
        process.env.FRONT_URL ? process.env.FRONT_URL + '/Home' : '/',
      );
      return cb(null, profile);
    }
    const new_user = await this.usersService.createUser({
      intraId: profile.id,
      email: profile._json.email,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      Username: profile.username,
    });

    const avatarturl = `https://ui-avatars.com/api/?name=${new_user.firstName}-${new_user.lastName}&background=7940CF&color=fff`;
    const result = await this.cloudinaryService.upload(
      new_user.userId,
      avatarturl,
    );

    await this.usersService.updateUser(new_user.userId, {
      avatar: `v${result.version}/${result.public_id}.${result.format}`,
    });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.email,
      new_user.userId,
    );

    await this.jwtUtils.updateRefreshedHash(
      new_user.userId,
      tokens.refresh_token,
    );

    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, {
      httpOnly: true,
      path: '/auth',
    });
    res.redirect(process.env.FRONT_URL ? process.env.FRONT_URL + '/Home' : '/');
    return cb(null, profile);
  }
}
