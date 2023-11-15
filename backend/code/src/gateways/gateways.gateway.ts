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
import * as crypto from 'crypto';
import { UsersService } from 'src/users/users.service';

interface GameInvite {
  inviter: string;
  opponentId: string;
  gameMode: string;
  client: Socket;
  gameId: string;
}

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
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() private server: Server;
  private games_map = new Map<string, Game>();
  private game_invites = new Set<GameInvite>();
  async handleConnection(client: Socket) {
    const userId = client.data.user.sub;
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
        let roomMembers = await this.prisma.roomMember.findMany({
          where: {
            roomId: message.roomId,
          },
          select: {
            userId: true,
            is_banned: true,
          },
        });
        roomMembers = roomMembers.filter(
          (member) =>
            member.userId !== message.authorId &&
            member.userId !== notif.actorId &&
            !member.is_banned,
        );

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

  @SubscribeMessage('status')
  async handleStatusEvent(@MessageBody() data: any) {
    console.log('status event', data);
    const userId = data.userId;
    const status = this.server.sockets.adapter.rooms.get(`User:${userId}`)?.size
      ? 'online'
      : 'offline';
    if (status === 'offline') {
      return { status, inGame: false };
    }
    const userSockets = await this.server.in(`User:${userId}`).fetchSockets();
    let inGame = false;
    for await (const socket of userSockets) {
      if (socket.data.user.inGame) {
        inGame = true;
        break;
      }
    }
    return { status, inGame };
  }

  @SubscribeMessage('startGame')
  handleGameStartEvent(client: Socket, data: { gameMode: string }) {
    console.log(client.data.user);
    this.eventEmitter.emit('game.start', { client, gameMode: data.gameMode });
  }
  // @SubscribeMessage('getPlayers')
  // getPlayers() {
  //   this.server.emit("players",[this.p1Data ,this.p2Data])
  // }
  private async checkIfCanInvite(userId: string) {
    const opententSockets = await this.server
      .in(`User:${userId}`)
      .fetchSockets();
    if (opententSockets.length === 0) {
      return { error: 'offline' };
    }
    for await (const socket of opententSockets) {
      if (socket.data.user?.inGame) {
        return { error: 'already in game' };
      }
      if (socket.data.user?.inQueue) {
        return { error: 'already in queue' };
      }
    }
    const invite = Array.from(this.game_invites).find(
      (invite) => invite.opponentId === userId || invite.inviter === userId,
    );
    if (invite) {
      return { error: 'already Invited or Inviting to a game' };
    }
    return { error: null };
  }

  @SubscribeMessage('inviteToGame')
  async handleInviteToGameEvent(client: Socket, data: any) {
    const [inviter, opponent] = await Promise.all([
      this.checkIfCanInvite(client.data.user.sub),
      this.checkIfCanInvite(data.opponentId),
    ]);

    if (inviter.error || opponent.error) {
      return {
        error: inviter.error ? `You are ${inviter.error}` : opponent.error,
      };
    }

    const gameId = crypto.randomBytes(16).toString('hex');
    this.server.to(`User:${data.opponentId}`).emit('invitedToGame', {
      inviterId: client.data.user.sub,
      gameId,
    });
    this.game_invites.add({
      inviter: client.data.user.sub,
      gameMode: data.gameMode,
      client,
      gameId,
      opponentId: data.opponentId,
    });
    return { error: null, gameId };
  }

  @SubscribeMessage('acceptGame')
  async handleAcceptGameEvent(client: Socket, data: any) {
    const game_invite = Array.from(this.game_invites).find(
      (invite) => invite.gameId === data.gameId,
    );
    //TODO: check if user is already in queue
    // check if already has an active invite from anyone
    // check if he is already on game || save if user is in game by saving it in the data of socket
    // check if user is offline
    if (!game_invite) {
      client.emit('game.declined', {
        gameId: data.gameId,
      });
      return;
    }
    this.game_invites.delete(game_invite);
    this.server.to(`User:${data.inviterId}`).emit('game.accepted', {
      accepter: client.data.user.sub,
    });

    const invterData = await this.usersService.getUserById(data.inviterId);
    const opponentData = await this.usersService.getUserById(
      client.data.user.sub,
    );

    // launch the game
    this.eventEmitter.emit('game.launched', [
      {
        socket: game_invite.client,
        userData: invterData,
      },
      {
        socket: client,
        userData: opponentData,
      },
    ]);
  }

  @SubscribeMessage('declineGame')
  async handleDeclineGameEvent(client: Socket, data: any) {
    const game_invite = Array.from(this.game_invites).find(
      (invite) => invite.gameId === data.gameId,
    );
    if (!game_invite) {
      return;
    }

    this.game_invites.delete(game_invite);

    if (game_invite.inviter === client.data.user.sub) {
      console.log('declined by inviter');
      this.server.to(`User:${game_invite.opponentId}`).emit('game.declined', {
        decliner: client.data.user.sub,
        gameId: data.gameId,
      });
    } else {
      console.log('decliner is the opponent');
      this.server.to(`User:${game_invite.inviter}`).emit('game.declined', {
        decliner: client.data.user.sub,
        gameId: data.gameId,
      });
    }
  }

  @OnEvent('game.launched')
  async handleGameLaunchedEvent(clients: any, mode: string) {
    const game_channel = crypto.randomBytes(16).toString('hex');
    // console.log(game_channel);
    clients.forEach((client: any) => {
      client.socket.join(game_channel);
      client.socket.data.user.inGame = true;
    });
    const new_game = new Game(this.eventEmitter, this.server, mode);

    new_game.setplayerScokets(
      clients[0].socket,
      clients[1].socket,
      clients[0].userData,
      clients[1].userData,
    );
    new_game.start(game_channel);
    this.games_map.set(game_channel, new_game);
    this.server.to(game_channel).emit('game.launched', game_channel);
  }

  @OnEvent('game.end')
  async handleGameEndEvent(data: any) {
    this.games_map.delete(data.gameid);
    console.log('game ended');
    console.log(data);
    const sockets = await this.server.in(data.gameid).fetchSockets();
    this.server.to(data.gameid).emit('game.end', data);
    console.log(data);

    for await (const socket of sockets) {
      socket.data.user.inGame = false;
    }
    if (data.resign === 0) {
      await this.prisma.match.create({
        data: {
          participant1Id: data.p1Data.userId,
          participant2Id: data.p2Data.userId,
          winner_id:
            data.p1Score > data.p2Score
              ? data.p1Data.userId
              : data.p2Data.userId,
          score1: data.p1Score,
          score2: data.p2Score,
        },
      });
    } else if (data.resign === 1) {
      await this.prisma.match.create({
        data: {
          participant1Id: data.p1Data.userId,
          participant2Id: data.p2Data.userId,
          winner_id: data.p2Data.userId,
          score1: 0,
          score2: 5,
        },
      });
    } else if (data.resign === 2) {
      await this.prisma.match.create({
        data: {
          participant1Id: data.p1Data.userId,
          participant2Id: data.p2Data.userId,
          winner_id: data.p1Data.userId,
          score1: 5,
          score2: 0,
        },
      });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoomEvent(client: Socket, data: any) {
    const userId = client.data.user.sub;
    const member = await this.prisma.roomMember.findFirst({
      where: {
        userId: data.memberId,
        roomId: data.roomId,
      },
    });
    if (member && !member.is_banned && userId === data.memberId) {
      client.join(`Room:${data.roomId}`);
    }
  }

  @SubscribeMessage('PingOnline')
  async handlePingOnlineEvent(client: Socket, data: any) {
    const friendId = data.friendId;
    if (this.server.sockets.adapter.rooms.get(`User:${friendId}`)?.size) {
      client.emit('friendOnline', friendId);
    } else {
      client.emit('friendOffline', friendId);
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
    const clients = await this.server
      .in(`User:${data.memberId}`)
      .fetchSockets();
    const clientsToBan = clients.filter(
      (client) => client.data.user.sub === data.memberId,
    );
    if (clientsToBan.length) {
      for await (const client of clientsToBan) {
        client.leave(`Room:${data.roomId}`);
        if (data?.type === 'kick') {
          client.emit('roomDeparture', {
            roomId: data.roomId,
            type: 'kick',
          });
        }
      }
    }
  }
}
