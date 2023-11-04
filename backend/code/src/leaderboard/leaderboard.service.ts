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
    const leaderboardsPromises =  leaderboard.map(async (user ) => {
        const lead = await this.prisma.user.findUnique({
        where: {
          userId: user.winner_id,
        },
        select: {
          Username: true,
          firstName: true,
          lastName: true,
          avatar: true,
          userId: true,
        },
      },
      )
      return {
        ...lead,
        wins: user._count.id
      }
    });
    return await Promise.all(leaderboardsPromises);
  }
}
