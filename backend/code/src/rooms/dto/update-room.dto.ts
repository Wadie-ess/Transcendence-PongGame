import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoomType } from '@prisma/client';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  name: string;

  @IsOptional()
  type: RoomType;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}
