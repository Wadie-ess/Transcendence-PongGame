import { EventEmitter2 } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';

export class Game {
  constructor(private readonly eventEmitter: EventEmitter2) {}
  private async loop() {
    console.log('loop');
    await this.sleep(5000);
    this.loop();
  }

  start(ngameid: string) {
    console.log('game started', ngameid);
    this.gameid = ngameid;
    this.loop();
  }

  setplayerScokets(p1socket: Socket, p2socket: Socket) {
    this.p1socket = p1socket;
    this.p2socket = p2socket;

    this.p1socket.on('move', (data) => {
      console.log('heh');
      console.log(data);
    });
    this.p2socket.on('move', (data) => {
      console.log('heh');
      console.log(data);
    });
    this.p1socket.on('disconnect', () => {
      console.log('p1 disconnected');
      this.emitGameEnd('p1 disconnected');
    });
    this.p2socket.on('disconnect', () => {
      console.log('p2 disconnected');
      this.emitGameEnd('p2 disconnected');
    });
  }

  private emitGameEnd(message: string) {
    console.log('game end');
    this.eventEmitter.emit('game.end', {
      message: message,
      gameid: this.gameid,
    });
  }

  private sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private gameid: string;
  private p1socket: Socket;
  private p2socket: Socket;
}
