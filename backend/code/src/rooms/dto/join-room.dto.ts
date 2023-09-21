import { IsNotEmpty, IsString, IsOptional, Length } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(8, 32)
  password?: string;
}
