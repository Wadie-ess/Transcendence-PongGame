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
import { $Enums, Notification } from '@prisma/client';

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
    // const rooms = this.prisma.roomMember.findMany({
    //   where: {
    //     userId: userId,
    //   },
    //   select: {
    //     room: {
    //       select: {
    //         id: true,
    //         name: true,
    //       },
    //     },
    //   },
    // });
    // rooms.then((rooms) => {
    //   rooms.forEach((room) => {
    //     client.join(`Room:${room.room.id}`);
    //     console.log(`Room:${room.room.id}`);
    //   });
    // });
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
    const chanellname: string = `Room:${message.roomId}`;
    this.server.to(chanellname).emit('message', message);
  }

  private async createNotification(notif: Partial<Notification>) {
    const newNotif = await this.prisma.notification.create({
      data: {
        actorId: notif.actorId,
        receiverId: notif.receiverId,
        type: notif.type,
        entity_type: notif.entity_type,
        entityId: notif.entityId,
      },
      include: {
        actor: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        receiver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return newNotif;
  }

  @OnEvent('sendNotification')
  async sendNotification(notif: Partial<Notification>) {
    // create the notification on the database
    switch (notif.type) {
      case $Enums.NotifType.acceptFriend:
      case $Enums.NotifType.addFriend: {
        const newNotif = await this.createNotification(notif);
        const channellname: string = `User:${newNotif.receiverId}`;
        this.server.to(channellname).emit('notification', {
          ...newNotif,
          entity: null,
        });
        break;
      }
      case $Enums.NotifType.message: {
        const message = await this.prisma.message.findUnique({
          where: {
            id: notif.entityId,
          },
          include: {
            author: {
              select: {
                avatar: true,
                Username: true,
              },
            },
            room: {
              select: {
                type: true,
              },
            },
          },
        });
        const roomMembers = await this.prisma.roomMember.findMany({
          where: {
            roomId: message.roomId,
          },
          select: {
            userId: true,
          },
        });
        const clientsSockets = await this.server
          .in(`Room:${message.roomId}`)
          .fetchSockets();
        for await (const member of roomMembers) {
          let found = false;
          for await (const clientSocket of clientsSockets) {
            if (clientSocket.data.user.sub === member.userId) {
              found = true;
              break;
            }
          }

          if (found) {
            continue;
          }
          const newNotif = await this.createNotification({
            ...notif,
            receiverId: member.userId,
          });
          const channellname: string = `User:${newNotif.receiverId}`;
          this.server.to(channellname).emit('notification', {
            ...newNotif,
            entity: new MessageFormatDto(message),
          });
        }
        break;
      }
    }
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

  @SubscribeMessage('joinRoom')
  async handleJoinRoomEvent(data: any) {
    const member = await this.prisma.roomMember.findFirst({
      where: {
        userId: data.memberId,
        roomId: data.roomId,
      },
    });
    if (member && !member.is_banned) {
      const banedClientSocket = await this.server
        .in(`User:${data.memberId}`)
        .fetchSockets();
      if (banedClientSocket.length > 0) {
        banedClientSocket[0].join(`Room:${data.roomId}`);
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
        banedClientSocket[0].join(`Room:${data.roomId}`);
      }
    }
  }

  @SubscribeMessage('roomDeparture')
  async hundleDeparture(
    @MessageBody() data: { roomId: string; memberId: string; type: string },
  ) {
    const clients = await this.server.in(`Room:${data.roomId}`).fetchSockets();
    console.log(`Room:${data.roomId}`);
    const clientToBan = clients.find(
      (client) => client.data.user.sub === data.memberId,
    );
    if (clientToBan) {
      clientToBan.leave(`Room:${data.roomId}`);
      if (data?.type === 'kick') {
        clientToBan.emit('roomDeparture', {
          roomId: data.roomId,
          type: 'kick',
        });
      }
    }
  }
}
