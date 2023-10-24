import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaderBoardService {
  constructor(private prisma: PrismaService) {}
  async getLeaderBoard(offset: number, limit: number) {
    const leaderboard = await this.prisma.match.groupBy({
      skip: offset,
      take: limit,
      by: ['winner_id'],
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });
    return leaderboard.map((user) => ({
      userId: user.winner_id,
      wins: user._count.id,
    }));
  }
}
