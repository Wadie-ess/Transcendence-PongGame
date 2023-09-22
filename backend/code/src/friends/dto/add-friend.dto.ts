import { IsNotEmpty, IsString } from 'class-validator';

export class AddFriendDto {
  @IsString()
  @IsNotEmpty()
  friendId: string;
}
