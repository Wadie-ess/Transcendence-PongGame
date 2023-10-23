import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class GameService {
  constructor() {
    // this.launchGame();
  }

  private waitingPlayers: string[] = [];

  @OnEvent('game.start')
  handleGameStartEvent(client: any) {
    this.waitingPlayers.push(client.id);
    console.log('client subscribed to the queue');
  }

  private launchGame() {
    setInterval(() => {
      console.log('waitingPlayers');
      if (this.waitingPlayers.length >= 2) {
        console.log('Game launched!');
        const two_players = this.waitingPlayers.splice(0, 2);
        console.log(two_players);
      }
    }, 1000);
  }
}
