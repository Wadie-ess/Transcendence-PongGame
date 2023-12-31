import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { PICTURE } from 'src/profile/dto/profile.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {
    this.launchGame();
  }

  private classicwaitingPlayers: { socket: Socket; userData: Partial<User> }[] =
    [];

  private extraWaitingPlayers: { socket: Socket; userData: Partial<User> }[] =
    [];

  @OnEvent('game.start')
  async handleGameStartEvent(data: {
    client: Socket;
    gameMode: string;
    mode: string;
  }) {
    if (data.mode === 'register') {
      const client = data.client;
      if (client.data.user?.inQueue) return;
      const gameMode = data.gameMode;
      const userId = client.data.user.sub;
      const userData = await this.getUser(userId);
      client.data.user.inQueue = true;

      if (gameMode === 'cassic')
        this.classicwaitingPlayers.push({ socket: client, userData: userData });
      else if (gameMode === 'extra')
        this.extraWaitingPlayers.push({ socket: client, userData: userData });
    } else if (data.mode === 'unregister') {
      const client = data.client;
      const gameMode = data.gameMode;
      client.data.user.inQueue = false;
      if (gameMode === 'cassic')
        this.classicwaitingPlayers = this.classicwaitingPlayers.filter(
          (player) => player.socket.id !== client.id,
        );
      else if (gameMode === 'extra')
        this.extraWaitingPlayers = this.extraWaitingPlayers.filter(
          (player) => player.socket.id !== client.id,
        );
    }
  }

  //NOTE: add game modes here
  private launchGame() {
    setInterval(() => {
      if (this.classicwaitingPlayers.length >= 2) {
        const two_players = this.classicwaitingPlayers.splice(0, 2);
        this.eventEmitter.emit('game.launched', two_players, 'classic');
      }
      if (this.extraWaitingPlayers.length >= 2) {
        const two_players = this.extraWaitingPlayers.splice(0, 2);
        this.eventEmitter.emit('game.launched', two_players, 'extra');
      }
    }, 5027);
  }
  async getUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: userId,
      },
      select: {
        userId: true,
        Username: true,
        avatar: true,
      },
    });
    return user;
  }
  async getHistory(userId: string, offset: number, limit: number) {
    const matches = await this.prisma.match.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            participant1Id: userId,
          },
          {
            participant2Id: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
        score1: true,
        score2: true,
        participant1: {
          select: {
            userId: true,
            Username: true,
            avatar: true,
          },
        },
        participant2: {
          select: {
            userId: true,
            Username: true,
            avatar: true,
          },
        },
      },
    });
    return matches.map((match) => {
      const avatar1: PICTURE = {
        thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${match.participant1.avatar}`,
        medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${match.participant1.avatar}`,
        large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${match.participant1.avatar}`,
      };
      const avatar2: PICTURE = {
        thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${match.participant2.avatar}`,
        medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${match.participant2.avatar}`,
        large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${match.participant2.avatar}`,
      };
      return {
        match: {
          createdAt: match.createdAt,
          Player1: {
            id: match.participant1.userId,
            username: match.participant1.Username,
            score: match.score1,
            avatar: avatar1,
          },
          Player2: {
            id: match.participant2.userId,
            username: match.participant2.Username,
            score: match.score2,
            avatar: avatar2,
          },
        },
      };
    });
  }
}
