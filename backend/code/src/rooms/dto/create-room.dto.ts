import { ApiProperty } from '@nestjs/swagger';
import { RoomType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateRoomDto {
  // @IgnoreName('type', { message: 'room name is not required on type dm' })
  @ApiProperty({ description: 'name of the room required if type is not dm' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  @ValidateIf((o) => o.type !== 'dm')
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

  @ApiProperty({ description: 'second member of the room' })
  @ValidateIf((o) => o.type === 'dm')
  @IsNotEmpty()
  @IsString()
  secondMember: string;
}
