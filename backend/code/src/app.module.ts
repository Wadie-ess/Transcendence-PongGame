import { Module } from '@nestjs/common';
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
import { GameModule } from './game/game.module';
import { LeaderBoardModule } from './leaderboard/leaderboard.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

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
    GameModule,
    LeaderBoardModule,
    ThrottlerModule.forRoot([
      {
        ttl: 6000,
        limit: 1000000,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    Gateways,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
