import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { RoomsModule } from './rooms/rooms.module';
import { FriendsModule } from './friends/friends.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MessagesModule } from './messages/messages.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Gateways } from './gateways/gateways.gateway';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    RoomsModule,
    FriendsModule,
    CloudinaryModule,
    MessagesModule,
    EventEmitterModule.forRoot(),
    LeaderBoardModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, Gateways],
})
export class AppModule {}
