import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/auth.type';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtUtils } from './utils/jwt_utils/jwt_utils';
import { v4 as uuiv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtUtils: JwtUtils,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: AuthDto): Promise<Tokens> {
    const hash = await bcrypt.hash(dto.password, 10);
    const new_user = await this.prisma.user
      .create({
        data: {
          email: dto.email,
          password: hash,
          intraId: 'placeholder',
          intraUsername: 'placeholder',
          UUId: uuiv4(),
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ForbiddenException('Credentials already exist');
          }
        }
        throw err;
      });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.intraUsername,
      new_user.UUId,
    );
    await this.jwtUtils.updateRefreshedHash(
      new_user.UUId,
      tokens.refresh_token,
    );

    return tokens;
  }

  async refresh(refresh_token: string, userId: string): Promise<Tokens> {
    const user = await this.prisma.user.findUnique({
      where: {
        UUId: userId,
      },
    });

    if (!user) throw new ForbiddenException('User not found');
    // FIXME: fix that shiit
    // check if refresh_token is the same as in the data databse and if it already exists

    if (!user.refreshedHash)
      throw new ForbiddenException('Invalid refresh token oo');

    const is_match = await bcrypt.compare(refresh_token, user.refreshedHash);
    if (!is_match) throw new ForbiddenException('Invalid refresh token');
    const tokens = await this.jwtUtils.generateTokens(
      user.intraUsername,
      user.UUId,
    );
    await this.jwtUtils.updateRefreshedHash(user.UUId, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user
      .update({
        where: {
          UUId: userId,
        },
        data: {
          refreshedHash: null,
        },
      })
      .catch((err) => {
        if (err instanceof PrismaClientKnownRequestError) {
          if (err.code === 'P2016') {
            throw new ForbiddenException('User not found');
          }
        }
        throw err;
      });
  }
}
