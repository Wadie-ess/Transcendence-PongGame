import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomDto } from './create-room.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoomType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  type: RoomType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({ required: false })
  password: string;
}
