import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { DeleteRoomDto } from './dto/delete-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ChangeOwnerDto } from './dto/change-owner.dto';
import { SetAdminDto } from './dto/set-admin.dto';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('rooms')
@ApiCookieAuth('X-Access-Token')
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

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async joinRoom(
    @Body() memberdata: JoinRoomDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.joinRoom(memberdata, userId);
  }

  @Post('leave')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async leaveRoom(
    @Body() memberdata: LeaveRoomDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.leaveRoom(memberdata, userId);
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async deleteRoom(
    @Body() roomdata: DeleteRoomDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.deleteRoom(roomdata, userId);
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async updateRoom(
    @Body() roomdata: UpdateRoomDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.updateRoom(roomdata, userId);
  }
  @Post('changeOwner')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async changeOwner(
    @Body() roomdata: ChangeOwnerDto,
    @GetCurrentUser('userId') userId: string,
    ){
    return await this.roomsService.changeOwner(roomdata, userId);
  }
  @Post('setAdmin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async setAdmin(
    @Body() roomdata: SetAdminDto,
    @GetCurrentUser('userId') userId: string,
    ){
    return await this.roomsService.setAdmin(roomdata, userId);
  }
}
