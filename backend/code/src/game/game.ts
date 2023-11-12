import { EventEmitter2 } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';

export class Game {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly server: Server,
  ) {}
  private async loop() {
    console.log('loop');
    await this.sleep(5000);

    this.loop();
  }

  private async sleepCounter() {
    let timer = 3000;

    for (let i = 0; i < 4; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.server.emit('timer', timer);
      timer -= 1000;
    }
  }
  async start(ngameid: string) {
    console.log('game started', ngameid);
    this.gameid = ngameid;
    await this.sleepCounter();
    this.loop();
  }

  setplayerScokets(p1socket: Socket, p2socket: Socket) {
    this.p1socket = p1socket;
    this.p2socket = p2socket;
    this.p1socket.on('up', (data) => {
      console.log('heh');
      console.log(data);
    });
    this.p2socket.on('down', (data) => {
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
