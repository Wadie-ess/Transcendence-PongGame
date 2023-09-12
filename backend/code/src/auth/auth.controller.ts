import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Redirect,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AtGuard } from './guards/at.guard';
import { FtOauthGuard } from './guards/ft.guard';
import { GetCurrentUser } from './decorator/get_current_user.decorator';
import { Tokens } from './types';
import { Response } from 'express';
import { RtGuard } from './guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @UseGuards(AtGuard)
  @Get('test')
  getTest() {
    return 'hello world';
  }

  @Get('login/42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('login/42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('/')
  login42Return() {
    return;
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  async logout(
    @GetCurrentUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(userId);
    res.clearCookie('X-Access-Token');
    res.clearCookie('X-Refresh-Token');
    return { message: 'ok' };
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUser('userId') userId: string,
  ) {
    const tokens: Tokens = await this.authService.refresh(refreshToken, userId);

    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });

    return { message: 'ok' };
  }
}
