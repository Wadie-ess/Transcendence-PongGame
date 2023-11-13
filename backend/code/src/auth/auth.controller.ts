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
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { FtOauthGuard } from './guards/ft.guard';
import { GetCurrentUser } from './decorator/get_current_user.decorator';
import { Tokens } from './types';
import { Response } from 'express';
import { RtGuard } from './guards/rt.guard';
import { ApiCookieAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { TfaValidateDto } from './dto/tfa-validta.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: AuthDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Res({ passthrough: true }) res: Response, @Body() dto: AuthDto) {
    const tokens: Tokens = await this.authService.login(dto);
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, {
      httpOnly: true,
      path: '/auth',
    });
  }

  @Get('login/42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @ApiExcludeEndpoint()
  @Get('login/42/return')
  @UseGuards(FtOauthGuard)
  login42Return() {
    return;
  }

  @Get('logout')
  @ApiCookieAuth('X-Refresh-Token')
  @UseGuards(RtGuard)
  @Redirect(process.env.FRONT_URL ? process.env.FRONT_URL : '/')
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
    res.cookie('X-Refresh-Token', tokens.refresh_token, {
      httpOnly: true,
      path: '/auth',
    });

    return { message: 'ok' };
  }

  @Post('validate2fa')
  async validate2fa(
    @Body() tfaValidation: TfaValidateDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.validateTwoFactorAuth(
      tfaValidation.otp,
      tfaValidation.tfaToken,
    );
    if (!data.isValid) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Invalid token' });
      return;
    }
    const tokens = data.tokens;
    res.cookie('X-Access-Token', tokens.access_token, { httpOnly: true });
    res.cookie('X-Refresh-Token', tokens.refresh_token, {
      httpOnly: true,
      path: '/auth',
    });
  }

  @Get('validatToken/:token')
  async validatToken(
    @Param('token') token: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.checkToken(token);
  }
}


