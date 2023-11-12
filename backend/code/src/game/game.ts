import { EventEmitter2 } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';

export class Game {

  constructor(private readonly eventEmitter: EventEmitter2 , private readonly server: Server) {}
  
  private screenAdapter(player,x:number , y:number , ballsize:number){
    let scale_x = player.w / this.w;
    let scale_y = player.h / this.h;

    let new_x = x * scale_x;
    let new_y = y * scale_y;

    let new_ball_size = ballsize * Math.min(scale_x, scale_y)
    return {x:new_x, y:new_y, ballsize:new_ball_size,p1Score:this.p1Score,p2Score:this.p2Score}
  }

  private paddleAdapterP1toP2(player1, player2, p1PaddleY:number , p2PaddleY:number, side:boolean){
    let scale =  this.h / player1.h;

    this.p1PaddleY = (p1PaddleY * scale) ;

    let scale2 =  player2.h / this.h ;

    let newPos = this.p1PaddleY * scale2;
    let scale_y = player2.h / this.h;
    let center = this.paddleHeight * scale_y;
    return {p1PaddleY:newPos,p2PaddleY:p2PaddleY-(center / 2),side:side};
  }
  private paddleAdapterP2toP1(player1, player2, p1PaddleY:number , p2PaddleY:number, side:boolean){
    let scale =  this.h / player2.h;

    this.p2PaddleY = (p2PaddleY * scale) ;

    let scale2 = player1.h / this.h ;

    let newPos = this.p2PaddleY * scale2;
    let scale_y = player1.h / this.h;
    let center = this.paddleHeight * scale_y;
    return {p1PaddleY:p1PaddleY - (center / 2),p2PaddleY:newPos,side:side};

  }

  private async loop() {
    if (this.closeGame)
      return ;
    console.log('loop');
    if (this.x + (this.ballSize / 2) + this.dx  >= this.w || this.x + this.dx  <= 0) 
      this.dx *= -1;
    if (this.y + (this.ballSize / 2) + this.dy  >= this.h || this.y + this.dy <= 0) 
      this.dy *= -1;

      // bx < paddleSize.x && 
      // //AND ball is below top edge of paddle
      // by > paddles[0].getPosition().y - (paddleSize.y * 0.5) &&
      // //AND ball is above bottom edge of paddle
      // by < paddles[0].getPosition().y + (paddleSize.y * 0.5)
    if (
      (this.y >= this.p1PaddleY  && this.y <= this.p1PaddleY  + this.paddleHeight
      && (this.x + (this.ballSize )) <= this.paddleWidth + 40 )
      )
    {

      this.dx *= -1;
      this.dy *= -1
    }
    if (
      (this.y >= this.p2PaddleY   && this.y <= this.p2PaddleY + this.paddleHeight
      && (this.x + (this.ballSize )) >= ( this.w - (this.paddleWidth + 20)) )
    ){
      this.dx *= -1;
      this.dy *= -1
    }
    if (
      ((this.y < this.p2PaddleY   || this.y > this.p2PaddleY + this.paddleHeight)
      && (this.x + (this.ballSize )) >= ( this.w - (this.paddleWidth + 10)) )
    ){
      this.p1Score += 1;
        await new Promise(resolve => setTimeout(resolve, 1000));
      this.init()
    }
    if (
      ((this.y < this.p1PaddleY  || this.y > this.p1PaddleY  + this.paddleHeight)
      && (this.x ) <= this.paddleWidth + 20)
      )
      {
        this.p2Score += 1;
          await new Promise(resolve => setTimeout(resolve, 1000));
        this.init();
      }
 
    console.log(this.x)
    console.log(this.y)
    this.x += this.dx;
    this.y += this.dy;
    console.log(this.p1Res)
    console.log(this.p2Res)
    if (parseFloat((this.p1Res.w / this.p1Res.h).toFixed(1)) !== 1.8 && parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)) !== 1.9){
      this.p1socket.emit("screen Error")
      this.emitGameEnd("end")
      this.p1socket.emit("lose","trying cheat");
      this.p2socket.emit("win","you win other player try to cheat");
      this.closeGame = true;
    }else{
      this.p1socket.emit("ball",this.screenAdapter(this.p1Res,this.x,this.y,this.ballSize))
      this.p2socket.emit("paddle",this.paddleAdapterP1toP2(this.p1Res, this.p2Res ,this.eventp1Paddle,this.eventp2Paddle,true))

    }
    
    if (parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)) !== 1.8 && parseFloat((this.p2Res.w / this.p2Res.h).toFixed(1)) !== 1.9){
      this.p1socket.emit("screen Error")
      this.emitGameEnd("end")
      this.p1socket.emit("win","you win other player try to cheat");
      this.p2socket.emit("lose","trying cheat");
      this.closeGame = true;
    }else{

      this.p2socket.emit("ball",this.screenAdapter(this.p2Res,this.x,this.y,this.ballSize))
      this.p1socket.emit("paddle",this.paddleAdapterP2toP1(this.p1Res, this.p2Res ,this.eventp1Paddle,this.eventp2Paddle,true))
    }
    
 

    await this.sleep(10);

    this.loop();
  }


    
  private async sleepCounter(){
    let timer = 5000;

    for (let i = 0; i < 6; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.server.emit("timer", timer);
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
    this.p1socket.on("mouse", (data) => {this.eventp1Paddle = data});
    this.p2socket.on("mouse", (data) => {this.eventp2Paddle = data});
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
    this.p2socket.emit("lose","you lost other player leave the game");
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

  private init(){
     this.x = this.w / 2;
     this.y = this.h / 2;
     this.ballSize = this.w / 42;
     this.dx = this.w / 200; 
     this.dy = this.w / 200;
     this.p1PaddleY = this.h / 2;
     this.p2PaddleY = this.h / 2;
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
  private dx: number = this.w / 200; 
  private dy: number = this.w / 200;
  private p1PaddleY: number = this.h / 2;
  private p2PaddleY: number = this.h / 2;
  private eventp1Paddle: number = 0;
  private eventp2Paddle: number = 0;
  private paddleHeight: number = this.h / 6;
  private paddleWidth: number = this.w / 70;
  private p1Score: number = 0;
  private p2Score: number = 0; 
  private p1Res = {h:0,w:0};
  private p2Res = {h:0,w:0};
  private closeGame = false;
}
