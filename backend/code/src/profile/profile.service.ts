import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async getProfile(userId: string): Promise<ProfileDto> {
    const user = await this.usersService.getUserById(userId, true);
    return new ProfileDto(user);
  }

  async updateProfile(
    userId: string,
    update_data: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const user = await this.usersService.updateUser(userId, update_data);
    return new ProfileDto(user);
  }
}
