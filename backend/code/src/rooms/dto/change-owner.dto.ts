import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangeOwnerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  roomId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  memberId: string;
}
