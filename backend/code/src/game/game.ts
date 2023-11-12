import { EventEmitter2 } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';

export class Game {

  constructor(private readonly eventEmitter: EventEmitter2 , private readonly server: Server) {}
  private screenAdapter(player,x:number , y:number , ballsize:number){
    let scale_x = player.w / this.w;
    let scale_y = player.h / this.h

    let new_x = x * scale_x
    let new_y = y * scale_y    

    let new_ball_size = ballsize * Math.min(scale_x, scale_y)
    return {x:new_x, y:new_y, ballsize:new_ball_size,p1Score:this.p1Score,p2Score:this.p2Score }
  }
  private async loop() {
    if (this.closeGame)
      return ;
    console.log('loop');
    if (this.x + (this.ballSize / 2) + this.dx  >= this.w || this.x  - (this.ballSize / 2) + this.dx  <= 0) 
      this.dx *= -1;
    if (this.y + (this.ballSize / 2) + this.dy  >= this.h || this.y  - (this.ballSize / 2) + this.dy <= 0) 
      this.dy *= -1;
    console.log(this.x)
    console.log(this.y)
    this.x += this.dx;
    this.y += this.dy;
    console.log(this.p1Res)
    console.log(this.p2Res)
    console.log(parseFloat((this.p1Res.w / this.p1Res.h).toFixed(1)))
    if (parseFloat((this.p1Res.w / this.p1Res.h).toFixed(1)) !== 1.8 && parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)) !== 1.9){
      this.p1socket.emit("screen Error")
      this.emitGameEnd("end")
      this.p1socket.emit("lose","trying cheat");
      this.p2socket.emit("win","you win other player try to cheat");
      this.closeGame = true;
    }else
    {
      this.p1socket.emit("ball",this.screenAdapter(this.p1Res,this.x,this.y,this.ballSize))
    }
    console.log(parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)))
    
    if (parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)) !== 1.8 && parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)) !== 1.9){
      this.p1socket.emit("screen Error")
      this.emitGameEnd("end")
      this.p1socket.emit("win","you win other player try to cheat");
      this.p2socket.emit("lose","trying cheat");
      this.closeGame = true;
    }else{

      this.p2socket.emit("ball",this.screenAdapter(this.p2Res,this.x,this.y,this.ballSize))
    }
    
 

    await this.sleep(30);
    this.loop();
  }


    
  private async sleepCounter(){
    let timer = 5000;

    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.server.to(this.gameid).emit('timer', timer);
      timer -= 1000;
    }
  }
  async start(ngameid: string) {
    console.log('game started', ngameid);
    this.gameid = ngameid;
    await this.sleepCounter()
    // await this.setplayerScokets(this.p1socket, this.p2socket ,)
    this.loop();
  }

  mouseAdapter(h : number){

  }
  setplayerScokets(p1socket: Socket, p2socket: Socket , p1Data:any, p2Data:any) {
    this.p1socket = p1socket;
    this.p2socket = p2socket;
    this.p1Data = p1Data;
    this.p2Data = p2Data;
    console.log(p1Data);
    console.log(p2Data);
    this.server.emit("players",[p1Data,p2Data])
    console.log("newfunc")
    this.p1socket.on('up', (data) => {
      console.log('heh');
      console.log(data);
    });
    this.p2socket.on('down', (data) => {
      console.log('heh');
      console.log(data);
    });

    this.p1socket.on("screen", (data) =>{this.p1Res = data})
    this.p2socket.on("screen", (data) =>{this.p2Res = data})
    this.p1socket.onAny(data => console.log(data))
    this.p1socket.on('disconnect', () => {
      console.log('p1 disconnected');
      this.emitGameEnd('p1 disconnected');
    });
    this.p2socket.on('disconnect', () => {
      console.log('p2 disconnected');
      this.emitGameEnd('p2 disconnected');
    });
    this.p1socket.on("leave", () => {this.emitGameEnd("end");
    this.p2socket.emit("win","you win other player leave the game");
    this.p1socket.emit("lose","you win other player leave the game");
    this.closeGame = true ;
    })
    this.p2socket.on("leave", () => {this.emitGameEnd("end");
    this.p1socket.emit("win","you win other player leave the game");
    this.p2socket.emit("lose","you win other player leave the game");
    this.closeGame = true ;
    })

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
  private p1Data: any;
  private p2Data: any;
  private w: number = 1067;
  private h: number = 600;
  private x: number = this.w / 2;
  private y: number = this.h / 2;
  private ballSize: number = this.w / 42;
  private dx: number = this.w / 250; 
  private dy: number = this.w / 250;
  private p1PaddleY: number = this.h / 2;
  private p2PaddleY: number = this.h / 2;
  private p1Score: number = 0;
  private p2Score: number = 0; 
  private p1Res = {h:0,w:0};
  private p2Res = {h:0,w:0};
  private closeGame = false;
}
