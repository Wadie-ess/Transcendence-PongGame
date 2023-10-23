import { ApiProperty } from '@nestjs/swagger';

export class LeaderboardResponseDto {
  @ApiProperty({ example: '60f1a7b0e1b3c2a4e8b4a1a0' })
  userId: string;
  @ApiProperty({ example: '3' })
  wins: number;
}
