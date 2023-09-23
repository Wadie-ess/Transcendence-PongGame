import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { throws } from 'assert';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot add yourself as a friend',
        HttpStatus.FORBIDDEN,
      );
    const friendshipId = [userId, friendId].sort().join('-');
    return this.prisma.friend.upsert({
      where: {
        id: friendshipId,
      },
      create: {
        id: friendshipId,
        from: {
          connect: {
            userId,
          },
        },
        to: {
          connect: { userId: friendId },
        },
      },
      update: {},
    });
  }

  async acceptFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot accept yourself as a friend',
        HttpStatus.FORBIDDEN,
      );
    const friendshipId = [userId, friendId].sort().join('-');

    const friend_request = await this.prisma.friend.findUnique({
      where: {
        id: friendshipId,
      },
    });

    if (!friend_request) {
      throw new HttpException(
        "Friend request doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    if (friend_request.toId !== userId) {
      throw new HttpException(
        "You can't accept a friend request that isn't yours",
        HttpStatus.FORBIDDEN,
      );
    }

    return this.prisma.friend.update({
      where: {
        id: friendshipId,
      },
      data: {
        accepted: true,
      },
    });
  }

  async rejectFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot reject yourself as a friend',
        HttpStatus.FORBIDDEN,
      );
    const friendshipId = [userId, friendId].sort().join('-');

    return this.prisma.friend.delete({
      where: {
        id: friendshipId,
      },
    });
 }

  async blockFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot block yourself',
        HttpStatus.FORBIDDEN,
      );
    const friendshipId = [userId, friendId].sort().join('-');
    await this.prisma.friend.deleteMany({
      where: {
        id: friendshipId,
      },
    });
    await this.prisma.blockedUsers.upsert({
      where: {
        id: friendshipId,
      },
      create: {
        id: friendshipId,
        Blcoked_by: {
          connect: {
            userId,
          },
        },
        Blocked: { connect: { userId: friendId } },
      },
      update: {},
    });
    return { message: 'User blocked' };
  }

  async unblockFriend(userId: string, friendId: string) {
    const friendshipId = [userId, friendId].sort().join('-');
    const blocked = await this.prisma.blockedUsers.findUnique({
      where: {
        id: friendshipId,
      },
    });
    if (!blocked) {
      throw new HttpException(
        'You cannot unblock a user that is not blocked',
        HttpStatus.FORBIDDEN,
      );
    }

    if (userId !== blocked.blocked_by_id) {
      throw new HttpException(
        'You cannot unblock a user that is not blocked by you',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.blockedUsers.deleteMany({
      where: {
        id: friendshipId,
      },
    });
    return { message: 'User unblocked' };
  }
}
