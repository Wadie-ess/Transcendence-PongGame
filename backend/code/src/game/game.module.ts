import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';

@Module({
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
