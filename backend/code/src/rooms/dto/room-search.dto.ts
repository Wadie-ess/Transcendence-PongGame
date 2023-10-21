import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RoomSearchDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  q: string;
}
