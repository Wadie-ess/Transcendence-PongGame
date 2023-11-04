import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageFormatDto } from 'src/messages/dto/message-format.dto';
import {} from '@nestjs/platform-socket.io';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { Game } from 'src/game/game';
@WebSocketGateway(3004, {
  cors: {
    origin: ['http://localhost:3001'],
  },
  transports: ['websocket'],
})
export class Gateways implements OnGatewayConnection {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private games_map = new Map<string, Game>();
  handleConnection(client: Socket) {
    const userId = client.data.user.sub;
    const rooms = this.prisma.roomMember.findMany({
      where: {
        userId: userId,
      },
      select: {
        room: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    rooms.then((rooms) => {
      rooms.forEach((room) => {
        client.join(`Romm:${room.room.id}`);
      });
    });
    client.join(`notif:${userId}`);
  }

  @WebSocketServer() private server: Server;

  @OnEvent('sendMessages')
  sendMessage(message: MessageFormatDto) {
    const chanellname: string = `Romm:${message.roomId}`;
    this.server.to(chanellname).emit('message', message);
  }

  @OnEvent('addFriendNotif')
  sendFriendReq(notif: any) {
    const channellname: string = `notif:${notif.recipientId}`;
    this.server.to(channellname).emit('message', notif);
  }

  @SubscribeMessage('startGame')
  handleGameStartEvent(client: Socket) {
    console.log(client.data.user);
    this.eventEmitter.emit('game.start', client);
  }

  @OnEvent('game.launched')
  handleGameLaunchedEvent(clients: any) {
    const game_channel = `Game:${clients[0].id}:${clients[1].id}`;
    console.log(game_channel);
    clients.forEach((client: any) => {
      client.join(game_channel);
    });
    const new_game = new Game(this.eventEmitter);
    new_game.setplayerScokets(clients[0], clients[1]);
    new_game.start(game_channel);
    this.games_map.set(game_channel, new_game);
    this.server.to(game_channel).emit('game.launched', game_channel);
  }

  @OnEvent('game.end')
  handleGameEndEvent(data: any) {
    console.log('game ended');
    console.log(data);
    this.server.to(data.gameid).emit('game.end', data);
    this.games_map.delete(data.gameid);
  }

  @SubscribeMessage('roomDeparture')
  hundleDeparture(client: Socket, data: { roomid: string; message: string }) {
    console.log(data);
  }
}
