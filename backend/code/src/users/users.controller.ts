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
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getUsers(@Query() query: usersSearchDto) {
    return this.usersService.getUsers(query.q);
  }

  @Post('twoFactorAuth')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async twoFactorAuth(
    @Body() dataDto: TwoFactorDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.usersService.twoFactorAuth(userId, dataDto.activate);
  }

  @Get('2faQrCode')
  @UseGuards(AtGuard)
  async get2faQrCode(@GetCurrentUser('userId') userId: string) {
    return this.usersService.genertQrcode(userId);
  }

  @Post('validate2fa')
  @UseGuards(AuthGuard('jwt'))
  async validate2fa(
    @Body('otp') token: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.usersService.validateTwoFactorAuth(userId, token);
  }
}
