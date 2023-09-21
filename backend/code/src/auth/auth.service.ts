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

@Injectable()
export class AuthService {
  constructor(
    private jwtUtils: JwtUtils,
    private usersService: UsersService,
  ) {}

  async signUp(dto: AuthDto): Promise<Tokens> {
    const hash = await bcrypt.hash(dto.password, 10);

    const new_user = await this.usersService.createUser({
      email: dto.email,
      password: hash,
    });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.intraUsername,
      new_user.userId,
    );
    await this.jwtUtils.updateRefreshedHash(
      new_user.userId,
      tokens.refresh_token,
    );

    return tokens;
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const is_match = await bcrypt.compare(dto.password, user.password);
    if (!is_match)
      throw new HttpException('Invalid password', HttpStatus.FORBIDDEN);

    const tokens = await this.jwtUtils.generateTokens(
      user.intraUsername,
      user.userId,
    );
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
    const tokens = await this.jwtUtils.generateTokens(
      user.intraUsername,
      user.userId,
    );
    await this.jwtUtils.updateRefreshedHash(user.userId, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateUser(userId, { refreshedHash: null });
  }
}
