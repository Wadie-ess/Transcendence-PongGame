import { ApiProperty } from '@nestjs/swagger';

export class FriendResponseDto {
  constructor(friendship: any) {
    this.fromId = friendship?.fromId;
    this.toId = friendship?.toId;
    this.accepted = friendship?.accepted;
  }
  @ApiProperty({ example: '60f1a7b0e1b3c2a4e8b4a1a0' })
  fromId: string;
  @ApiProperty({ example: '60f1a7b0e1b3c2a4e8b4a1a0' })
  toId: string;
  @ApiProperty()
  accepted: boolean;
}
