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
import { FtOauthGuard } from './guards/ft.guard';
import { GetCurrentUser } from './decorator/get_current_user.decorator';
import { Tokens } from './types';
import { Response } from 'express';
import { RtGuard } from './guards/rt.guard';
import { ApiCookieAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: AuthDto,
  ) {
    const tokens: Tokens = await this.authService.signUp(dto);
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto) {
    const tokens: Tokens = await this.authService.login(dto);
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, { httpOnly: true });
  }

  @Get('login/42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @ApiExcludeEndpoint()
  @Get('login/42/return')
  @UseGuards(FtOauthGuard)
  @Redirect(process.env.FRONT_URL+"/Home")
  login42Return() {
    return;
  }

  @Get('logout')
  @ApiCookieAuth('X-Refresh-Token')
  @UseGuards(RtGuard)
  @Redirect(process.env.FRONT_URL)
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
  @ApiCookieAuth('X-Refresh-Token')
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
