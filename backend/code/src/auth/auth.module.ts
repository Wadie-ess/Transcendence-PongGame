import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AtStrategy, RtStrategy } from './stratgies';
import { JwtModule } from '@nestjs/jwt';
import { FtStrategy } from './stratgies/ft.strategy';
import { JwtUtilsModule } from './utils/jwt_utils/jwt_utils.module';
import { UsersService } from 'src/users/users.service';
import { JwtConsts } from './constants/constants';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    JwtModule.register({ secret: JwtConsts.at_secret }),
    JwtUtilsModule,
  ],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    FtStrategy,
    UsersService,
    CloudinaryService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
