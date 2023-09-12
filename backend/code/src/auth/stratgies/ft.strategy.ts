import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { JwtUtils } from '../utils/jwt_utils/jwt_utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private prisma: PrismaService,
    private jwtUtils: JwtUtils,
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
    console.log(profile.id);
    const user = await this.prisma.user.findUnique({
      where: {
        intraId: profile.id,
      },
    });
    const res = req.res;
    if (user) {
      const tokens = await this.jwtUtils.generateTokens(
        user.intraUsername,
        user.UUId,
      );
      await this.jwtUtils.updateRefreshedHash(user.UUId, tokens.refresh_token);
      res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
      res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
      return cb(null, profile);
    }

    const new_user = await this.prisma.user
      .create({
        data: {
          intraId: profile.id,
          intraUsername: profile.username,
          UUId: uuidv4(),
        },
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new HttpErrorByCode[409]('User already exists');
          }
        }
        throw new Error('Something went wrong');
      });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.intraUsername,
      new_user.UUId,
    );
    await this.jwtUtils.updateRefreshedHash(
      new_user.UUId,
      tokens.refresh_token,
    );
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
    return cb(null, profile);
  }
}
