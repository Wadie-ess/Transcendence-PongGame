import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, UsersService],
})
export class FriendsModule {}
