import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(AtGuard)
  async getMe(@GetCurrentUser('userId') userId: string): Promise<ProfileDto> {
    return await this.profileService.getProfile(userId);
  }

  @Get(':id')
  @UseGuards(AtGuard)
  getUserById(@Param('id') Id: string) {
    return this.profileService.getProfile(Id);
  }

  @Post('me')
  @UseGuards(AtGuard)
  updateMe(
    @GetCurrentUser('userId') userId: string,
    @Body() update_data: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, update_data);
  }
}
