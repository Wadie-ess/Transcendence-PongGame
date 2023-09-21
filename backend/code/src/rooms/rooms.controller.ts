import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('create')
  @UseGuards(AtGuard)
  async createRoom(
    @Body() roomdata: CreateRoomDto,
    @GetCurrentUser('userId') roomOwnerId: string,
  ) {
    return await this.roomsService.createRoom(roomdata, roomOwnerId);
  }
}
