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
    console.log("recive msg !")
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
    this.eventEmitter.emit('game.start', client);
  }

  @OnEvent('game.launched')
  handleGameLaunchedEvent(clients: any) {
    const game_channel = `Game:${clients[0].id}:${clients[1].id}`;
    clients.forEach((client: any) => {
      client.join(game_channel);
    });
    this.server.to(game_channel).emit('game.launched', game_channel);
  }
}
