import { ApiProperty } from '@nestjs/swagger';
import { Room } from '@prisma/client';

export class RoomDataDto {
  constructor(room_dta: Room) {
    this.id = room_dta.id;
    this.name = room_dta.name;
    this.type = room_dta.type;
  }
  @ApiProperty({ example: 'cln8xxhut0000stofkkf' })
  id: string;
  @ApiProperty({ example: 'test room' })
  name: string;
  @ApiProperty({ example: 'public' })
  type: string;
}
