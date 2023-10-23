import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  secondMember: string;
}
