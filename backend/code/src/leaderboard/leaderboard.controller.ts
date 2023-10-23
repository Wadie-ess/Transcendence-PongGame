import { Controller, Get, Query, UseGuards, HttpStatus } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards/at.guard';
import { LeaderBoardService } from './leaderboard.service';
import { QueryOffsetDto } from 'src/friends/dto/query-ofsset-dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { LeaderboardResponseDto } from './dto/leaderboard.dto';

@ApiTags('leaderboard')
@Controller('leaderboard')
export class LeaderBoardController {
  constructor(private readonly leaderBordService: LeaderBoardService) {}

  @Get()
  @ApiResponse({
    type: LeaderboardResponseDto,
    status: HttpStatus.OK,
  })
  @UseGuards(AtGuard)
  async getLeaderBoard(@Query() { offset, limit }: QueryOffsetDto) {
    return this.leaderBordService.getLeaderBoard(offset, limit);
  }
}
