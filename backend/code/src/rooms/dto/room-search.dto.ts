import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RoomSearchDto {
  @ApiProperty()
  @IsNotEmpty()
  q: string;
}
