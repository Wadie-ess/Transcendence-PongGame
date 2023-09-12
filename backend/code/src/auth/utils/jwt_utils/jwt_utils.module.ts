import { Module } from '@nestjs/common';
import { JwtUtils } from './jwt_utils';
import { JwtService } from '@nestjs/jwt';
@Module({
  providers: [JwtUtils, JwtService],
  exports: [JwtUtils],
})
export class JwtUtilsModule {}
