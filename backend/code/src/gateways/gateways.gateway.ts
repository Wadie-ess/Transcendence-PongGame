import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class Gateways implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer() private server: Server;
  private games_map = new Map<string, Game>();
  async handleConnection(client: Socket) {
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
        console.log(`Romm:${room.room.id}`);
      });
    });
    client.join(`User:${userId}`);

    const frienduserIds = await this.prisma.friend.findMany({
      where: {
        OR: [
          {
            fromId: userId,
          },
          {
            toId: userId,
          },
        ],
      },
      select: {
        fromId: true,
        toId: true,
      },
    });

    const friendIds = frienduserIds
      .map((friend) => (friend.toId === userId ? friend.fromId : friend.toId))
      .filter(
        (id) => this.server.sockets.adapter.rooms.get(`User:${id}`)?.size,
      );

    client.emit('onlineFriends', friendIds);

    this.server.emit('friendOnline', userId);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.data.user.sub;

    this.server.emit('friendOffline', userId);
  }

  @OnEvent('sendMessages')
  sendMessage(message: MessageFormatDto) {
    console.log('recive msg !');
    const chanellname: string = `Romm:${message.roomId}`;
    this.server.to(chanellname).emit('message', message);
  }

  @OnEvent('addFriendNotif')
  sendFriendReq(notif: any) {
    const channellname: string = `User:${notif.recipientId}`;
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
    const new_game = new Game(this.eventEmitter , this.server);
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

  @SubscribeMessage('joinRoom')
  async handleJoinRoomEvent(data: any) {
    const member = await this.prisma.roomMember.findFirst({
      where: {
        userId: data.memberId,
        roomId: data.roomId,
      },
    });
    if (member) {
      const banedClientSocket = await this.server
        .in(`User:${data.memberId}`)
        .fetchSockets();
      if (banedClientSocket.length > 0) {
        banedClientSocket[0].join(`Romm:${data.roomId}`);
      }
    }
  }

  @SubscribeMessage('unban')
  async handleUnbanEvent(client: Socket, data: any) {
    const owner = await this.prisma.roomMember.findFirst({
      where: {
        userId: client.data.user.sub,
        roomId: data.roomId,
      },
    });
    if (!owner || owner.is_admin === false) {
      return;
    }
    const member = await this.prisma.roomMember.findFirst({
      where: {
        userId: data.memberId,
        roomId: data.roomId,
      },
    });
    if (member) {
      const banedClientSocket = await this.server
        .in(`User:${data.memberId}`)
        .fetchSockets();
      if (banedClientSocket.length > 0) {
        banedClientSocket[0].join(`Romm:${data.roomId}`);
      }
    }
  }

  @SubscribeMessage('roomDeparture')
  async hundleDeparture(
    @MessageBody() data: { roomId: string; memberId: string; type: string },
  ) {
    const clients = await this.server.in(`Romm:${data.roomId}`).fetchSockets();
    console.log(`Romm:${data.roomId}`);
    const clientToBan = clients.find(
      (client) => client.data.user.sub === data.memberId,
    );
    if (clientToBan) {
      clientToBan.leave(`Romm:${data.roomId}`);
      if (data?.type === 'kick') {
        clientToBan.emit('roomDeparture', {
          roomId: data.roomId,
          type: 'kick',
        });
      }
    }
  }
}
