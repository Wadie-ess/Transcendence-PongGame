import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types/auth.type';
import { JwtUtils } from './utils/jwt_utils/jwt_utils';
import { v4 as uuiv4 } from 'uuid';
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
      id: uuiv4(),
    });

    const tokens = await this.jwtUtils.generateTokens(
      new_user.intraUsername,
      new_user.id,
    );
    await this.jwtUtils.updateRefreshedHash(new_user.id, tokens.refresh_token);

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
      user.id,
    );
    await this.jwtUtils.updateRefreshedHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateUser(userId, { refreshedHash: null });
  }
}
