import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageFormatDto } from 'src/messages/dto/message-format.dto';
import {} from '@nestjs/platform-socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
@WebSocketGateway(3004, {
  cors: {
    origin: ['http://localhost:3001'],
  },
  transports: ['websocket'],
})
export class Gateways implements OnGatewayConnection {
  constructor(private prisma: PrismaService) {}
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
  }

  @WebSocketServer() private server: Server;

  @OnEvent('sendMessages')
  sendMessage(message: MessageFormatDto) {
    const chanellname: string = `Romm:${message.roomId}`;
    this.server.to(chanellname).emit('message', message);
  }
}
