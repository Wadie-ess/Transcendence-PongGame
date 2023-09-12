import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './stratgies';
import { JwtModule } from '@nestjs/jwt';
import { FtStrategy } from './stratgies/ft.strategy';
import { JwtUtilsModule } from './utils/jwt_utils/jwt_utils.module';

@Module({
  imports: [JwtModule.register({}), JwtModule, JwtUtilsModule],
  providers: [AuthService, AtStrategy, RtStrategy, FtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}