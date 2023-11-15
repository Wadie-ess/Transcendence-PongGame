import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { usersSearchDto } from './dto/search-user.dto';
import { TwoFactorDto } from './dto/two-factor.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getUsers(@Query() query: usersSearchDto, @GetCurrentUser('userId') userId: string) {
    return this.usersService.getUsers(query.q, userId);
  }

  @Post('enableTwoFactorAuth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async twoFactorAuth(
    @Body() dataDto: TwoFactorDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.usersService.twoFactorAuth(userId, dataDto);
  }
}
