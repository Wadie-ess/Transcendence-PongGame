import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { QueryOffsetDto } from 'src/friends/dto/query-ofsset-dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('history')
  @UseGuards(AtGuard)
  getHistory(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.gameService.getHistory(userId, offset, limit);
  }

  @Get('history/:id')
  @UseGuards(AtGuard)
  getHistoryId(
    @Param('id') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.gameService.getHistory(userId, offset, limit);
  }
}
