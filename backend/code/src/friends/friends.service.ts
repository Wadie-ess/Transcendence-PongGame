import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(userId: string, friendId: string) {
    const friend_request = await this.prisma.friend.findUnique({
      where: {
        unique_friend: {
          fromId: userId,
          toId: friendId,
        },
      },
    });

    if (friend_request) {
      throw new ConflictException('Friend request already sent');
    }
    return await this.prisma.friend.create({
      data: {
        from: {
          connect: { userId },
        },
        to: {
          connect: { userId: friendId },
        },
      },
    });
  }

  async acceptFriend(userId: string, friendId: string) {
    const friend_request = await this.prisma.friend.findUnique({
      where: {
        unique_friend: {
          fromId: friendId,
          toId: userId,
        },
      },
    });

    if (!friend_request) {
      throw new HttpException(
        "Friend request doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    if (friend_request.accepted) {
      throw new ConflictException('Friend request already accepted');
    }

    return await this.prisma.friend.update({
      where: {
        unique_friend: {
          fromId: friendId,
          toId: userId,
        },
      },
      data: {
        accepted: true,
      },
    });
  }

  async blockFriend(userId: string, friendId: string) {
    const friend_request = await this.prisma.friend.findUnique({
      where: {
        unique_friend: {
          fromId: friendId,
          toId: userId,
        },
      },
    });

    if (!friend_request) {
      throw new HttpException(
        "Friend request doesn't exist",
        HttpStatus.NOT_FOUND,
      );
    }

    if (friend_request.is_blocked && friend_request.blocked_by_id === userId) {
      throw new ConflictException('Friend already blocked');
    }

    return await this.prisma.friend.update({
      where: {
        unique_friend: {
          fromId: friendId,
          toId: userId,
        },
      },
      data: {
        is_blocked: true,
        blocked_by_id: userId,
      },
    });
  }

	async unblockFriend(
}
