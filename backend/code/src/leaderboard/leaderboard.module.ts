import { Module } from '@nestjs/common';
import { LeaderBoardController } from './leaderboard.controller';
import { LeaderBoardService } from './leaderboard.service';

@Module({
  controllers: [LeaderBoardController],
  providers: [LeaderBoardService],
})
export class LeaderBoardModule {}
