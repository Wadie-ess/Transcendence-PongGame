import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, ProfileModule, RoomsModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
