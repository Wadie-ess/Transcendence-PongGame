import { Module } from '@nestjs/common';
import { JwtUtils } from './jwt_utils';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
@Module({
  providers: [JwtUtils, JwtService, UsersService],
  exports: [JwtUtils],
})
export class JwtUtilsModule {}
