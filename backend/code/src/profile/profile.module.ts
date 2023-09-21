import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ProfileController],
	providers: [ProfileService, UsersService],
})
export class ProfileModule {}
