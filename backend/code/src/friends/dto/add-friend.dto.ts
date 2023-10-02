import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FriendDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
