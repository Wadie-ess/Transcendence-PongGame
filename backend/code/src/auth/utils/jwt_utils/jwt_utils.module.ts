import { Module } from '@nestjs/common';
import { JwtUtils } from './jwt_utils';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { JwtConsts } from 'src/auth/constants/constants';
@Module({
  imports: [JwtModule.register({ secret: JwtConsts.at_secret })],
  providers: [JwtUtils, JwtService, UsersService],
  exports: [JwtUtils],
})
export class JwtUtilsModule {}
