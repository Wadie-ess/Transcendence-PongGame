import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/auth.type';
import { JwtUtils } from './utils/jwt_utils/jwt_utils';
import { UsersService } from 'src/users/users.service';
import { authenticator } from 'otplib';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtUtils: JwtUtils,
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {}

  async signUp(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    await this.usersService.createUser({
      email: dto.email,
      password: hash,
    });
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const is_match = await bcrypt.compare(dto.password, user.password);
    if (!is_match)
      throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);

    const tokens = await this.jwtUtils.generateTokens(user.email, user.userId);
    await this.jwtUtils.updateRefreshedHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  async refresh(refresh_token: string, userId: string): Promise<Tokens> {
    const user = await this.usersService.getUserById(userId);

    if (!user) throw new ForbiddenException('User not found');

    if (!user.refreshedHash)
      throw new ForbiddenException('Invalid refresh token oo');

    const is_match = await bcrypt.compare(refresh_token, user.refreshedHash);
    if (!is_match) throw new ForbiddenException('Invalid refresh token');
    const tokens = await this.jwtUtils.generateTokens(user.email, user.userId);
    await this.jwtUtils.updateRefreshedHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateUser(userId, { refreshedHash: null });
  }

  async validateTwoFactorAuth(token: string, tfaToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { tfaToken },
      select: {
        tfaSecret: true,
        userId: true,
        tfaEnabled: true,
        email: true,
      },
    });

    if (!user) {
      throw new HttpException('Invalid token', 400);
    }

    if (!user.tfaEnabled) {
      throw new HttpException('Two factor authentication is not enabled', 400);
    }

    authenticator.options = { digits: 6 };
    const isValid = authenticator.verify({
      token,
      secret: user.tfaSecret,
    });

    if (isValid) {
      await this.prisma.user.update({
        where: { userId: user.userId },
        data: { tfaToken: null },
      });
      const tokens = await this.jwtUtils.generateTokens(
        user.email,
        user.userId,
      );
      await this.jwtUtils.updateRefreshedHash(
        user.userId,
        tokens.refresh_token,
      );
      return { isValid, tokens };
    }
    return { isValid };
  }
}
