import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
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
import { AuthGuard } from '@nestjs/passport';
import { QueryOffsetDto } from 'src/friends/dto/query-ofsset-dto';

@ApiTags('profile')
@ApiCookieAuth('X-Acces-Token')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOkResponse({ type: ProfileDto })
  @UseGuards(AuthGuard('jwt'))
  async getMe(@GetCurrentUser('userId') userId: string): Promise<ProfileDto> {
    return await this.profileService.getProfile(userId);
  }

  @Post('me')
  @ApiOkResponse({ type: ProfileDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  updateMe(
    @GetCurrentUser('userId') userId: string,
    @Body() update_data: UpdateProfileDto,
  ): Promise<ProfileDto> {
    return this.profileService.updateProfile(userId, update_data);
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
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5e6 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.profileService.uploadAvatar(userId, file);
  }

  @ApiExcludeEndpoint()
  @Get('avatar/:id')
  @UseGuards(AtGuard)
  getAvatar(@Param('id') recourseId: string) {
    return this.profileService.getAvatar(recourseId);
  }

  @Get('notifications')
  @UseGuards(AtGuard)
  getNotifications(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.profileService.getNotifications(userId, offset, limit);
  }

  @Post('read-notification/:id')
  @UseGuards(AtGuard)
  readNotification(
    @GetCurrentUser('userId') userId: string,
    @Param('id') notificationId: string,
  ) {
    return this.profileService.readNotification(userId, notificationId);
  }

  @Post('read-all-notifications')
  @UseGuards(AtGuard)
  readAllNotifications(@GetCurrentUser('userId') userId: string) {
    return this.profileService.readAllNotifications(userId);
  }

  // read a bunch of messages

  @Get('unread-messages')
  @UseGuards(AtGuard)
  getUnreadMessages(@GetCurrentUser('userId') userId: string) {
    return this.profileService.getUnreadMessages(userId);
  }

  @Post('read-messages')
  @UseGuards(AtGuard)
  readMessages(
    @GetCurrentUser('userId') userId: string,
    @Body() { messagesIds }: { messagesIds: string[] },
  ) {
    return this.profileService.readMessages(userId, messagesIds);
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
    return this.profileService.getFriendProfile(userId, Id);
  }
}
