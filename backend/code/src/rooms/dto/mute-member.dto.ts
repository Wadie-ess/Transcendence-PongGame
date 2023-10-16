import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MuteMemberDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  memberId: string;
}
