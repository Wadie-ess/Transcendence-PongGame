import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
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
import { QueryOffsetDto } from '../friends/dto/query-ofsset-dto';
import { RoomSearchDto } from './dto/room-search.dto';
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomDataDto } from './dto/room-data.dto';

@ApiTags('rooms')
@ApiCookieAuth('X-Access-Token')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiResponse({ type: RoomDataDto })
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

  @ApiResponse({
    status: HttpStatus.OK,
    schema: { default: { message: 'left room successfully' } },
  })
  @Post('leave')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async leaveRoom(
    @Body() memberdata: LeaveRoomDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.leaveRoom(memberdata, userId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      default: { message: 'deleted room successfully' },
    },
  })
  @Post('delete')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async deleteRoom(
    @Body() roomdata: DeleteRoomDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.deleteRoom(roomdata, userId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    type: RoomDataDto,
  })
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
  ) {
    return await this.roomsService.changeOwner(roomdata, userId);
  }

  @Post('setAdmin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async setAdmin(
    @Body() roomdata: ChangeOwnerDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.setAdmin(roomdata, userId);
  }

  @Post('kick')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async kickMember(
    @Body() memberdata: ChangeOwnerDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.kickMember(memberdata, userId);
  }

  @Post('mute')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async muteMember(
    @Body() memberdata: ChangeOwnerDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.muteMember(memberdata, userId);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getRooms(@Query() query: RoomSearchDto) {
    return await this.roomsService.getRooms(query);
  }

  @Get(':id/members')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async getRoomMembers(
    @Param('id') roomId: string,
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return await this.roomsService.getRoomMembers(
      roomId,
      userId,
      offset,
      limit,
    );
  }

  @Post('ban')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async banMember(
    @Body() memberData: ChangeOwnerDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.banMember(memberData, userId);
  }

  @Post('add')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async addMember(
    @Body() memberData: ChangeOwnerDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return await this.roomsService.addMember(memberData, userId);
  }
}
