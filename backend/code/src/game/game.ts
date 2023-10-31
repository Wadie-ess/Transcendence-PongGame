import { Socket } from 'socket.io';

export class Game {
  private async loop() {
    console.log('loop');
    await this.sleep(5000);
    this.loop();
  }

  start(gameid: string) {
    console.log('game started', gameid);
    this.loop();
  }

  setplayerScokets(p1socket: Socket, p2socket: Socket) {
    this.p1socket = p1socket;
    this.p2socket = p2socket;

    this.p1socket.on('move', (data) => {
      console.log(data);
    });
    this.p2socket.on('move', (data) => {
      console.log(data);
    });
  }

  private sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private p1socket: Socket;
  private p2socket: Socket;
}
