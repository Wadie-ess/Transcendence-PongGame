import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('profile')
@ApiCookieAuth('X-Acces-Token')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOkResponse({ type: ProfileDto })
  @UseGuards(AtGuard)
  async getMe(@GetCurrentUser('userId') userId: string): Promise<ProfileDto> {
    console.log(userId);
    return await this.profileService.getProfile(userId);
  }

  @Post('me')
  @ApiOkResponse({ type: ProfileDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  updateMe(
    @GetCurrentUser('userId') userId: string,
    @Body() update_data: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return this.profileService.updateProfile(userId, update_data);
  }

  @Get(':id')
  @ApiOkResponse({ type: ProfileDto })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User id',
    example: '60f1a7b0e1b3c2a4e8b4a1a0',
  })
  @UseGuards(AtGuard)
  getUserById(
    @Param('id') Id: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.profileService.getProfile(userId, Id);
  }

  @Post('avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AtGuard)
  uploadAvatar(
    @GetCurrentUser('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(userId, file);
  }

  @ApiExcludeEndpoint()
  @Get('avatar/:id')
  @UseGuards(AtGuard)
  getAvatar(@Param('id') recourseId: string) {
    return this.profileService.getAvatar(recourseId);
  }
}
