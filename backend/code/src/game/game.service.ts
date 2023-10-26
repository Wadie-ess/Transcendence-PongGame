import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma/prisma.service';
import { PICTURE } from 'src/profile/dto/profile.dto';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {
    // this.launchGame();
  }

  private waitingPlayers: string[] = [];

  @OnEvent('game.start')
  handleGameStartEvent(client: any) {
    this.waitingPlayers.push(client.id);
    console.log('client subscribed to the queue');
  }

  private launchGame() {
    setInterval(() => {
      console.log('waitingPlayers');
      if (this.waitingPlayers.length >= 2) {
        console.log('Game launched!');
        const two_players = this.waitingPlayers.splice(0, 2);
        console.log(two_players);
      }
    }, 1000);
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
            Username: true,
            avatar: true,
          },
        },
        participant2: {
          select: {
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
            username: match.participant1.Username,
            score: match.score1,
            avatar: avatar1,
          },
          Player2: {
            username: match.participant2.Username,
            score: match.score2,
            avatar: avatar2,
          },
        },
      };
    });
  }
}