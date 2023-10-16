import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { usersSearchDto } from './dto/search-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getUsers(@Query() query: usersSearchDto) {
    return this.usersService.getUsers(query.q);
  }
}
