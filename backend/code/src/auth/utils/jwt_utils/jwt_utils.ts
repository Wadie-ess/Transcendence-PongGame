import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConsts } from 'src/auth/constants/constants';
import { Tokens } from 'src/auth/types/auth.type';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtUtils {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async generateTokens(username: string, userId: string): Promise<Tokens> {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { username, sub: userId },
        {
          secret: JwtConsts.at_secret,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { username, sub: userId },
        {
          secret: JwtConsts.rt_secret,
          expiresIn: '7d',
        },
      ),
    ]);
    return { access_token, refresh_token };
  }

  async updateRefreshedHash(
    userId: string,
    refeshedHash: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refeshedHash, 10);
    await this.prisma.user.update({
      where: {
        UUId: userId,
      },
      data: {
        refreshedHash: hash,
      },
    });
  }
}
