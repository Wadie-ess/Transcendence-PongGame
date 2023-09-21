import { RoomType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(RoomType)
  type: RoomType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password?: string;
}
