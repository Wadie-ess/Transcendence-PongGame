import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { FriendResponseDto } from './dto/frined-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FriendProfileDto } from './dto/friend-profile.dto';
import { $Enums } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private evenEmitter: EventEmitter2,
  ) {}

  async addFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot add yourself as a friend',
        HttpStatus.FORBIDDEN,
      );
    const friendshipId = [userId, friendId].sort().join('-');
    const frinedship = await this.prisma.friend.upsert({
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
    this.evenEmitter.emit('sendNotification', {
      receiverId: friendId,
      actorId: userId,
      type: $Enums.NotifType.addFriend,
      entityId: friendshipId,
      entity_type: 'friend',
    });
    return new FriendResponseDto(frinedship);
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

    const friendship = await this.prisma.friend.update({
      where: {
        id: friendshipId,
      },
      data: {
        accepted: true,
      },
    });
    this.evenEmitter.emit('sendNotification', {
      receiverId: friendId,
      actorId: userId,
      type: $Enums.NotifType.acceptFriend,
      entityId: friendshipId,
      entity_type: 'friend',
    });
    return new FriendResponseDto(friendship);
  }

  async rejectFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot reject yourself as a friend',
        HttpStatus.FORBIDDEN,
      );
    const friendshipId = [userId, friendId].sort().join('-');

    await this.prisma.friend.delete({
      where: {
        id: friendshipId,
      },
    });
    return { message: 'done' };
  }

  async blockFriend(userId: string, friendId: string) {
    if (userId === friendId)
      throw new HttpException(
        'You cannot block yourself',
        HttpStatus.FORBIDDEN,
      );

    const commonRoom = await this.prisma.room.findFirst({
      where: {
        AND: [
          {
            type: 'dm',
          },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
          {
            members: {
              some: {
                userId: friendId,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

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
        ...(commonRoom && { dmRoomId: commonRoom.id }),
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
    const blocked = await this.usersService.getBlockbyId(friendshipId);
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

  async getFriendsList(userId: string) {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [
          {
            fromId: userId,
            accepted: true,
          },
          {
            toId: userId,
            accepted: true,
          },
        ],
      },
      select: {
        from: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        to: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return friends.map((friend) => {
      if (friend.from.userId === userId) {
        return new FriendProfileDto(friend.to);
      } else {
        return new FriendProfileDto(friend.from);
      }
    });
  }

  async getFriendsRequests(userId: string, offset: number, limit: number) {
    const friends = await this.prisma.friend.findMany({
      skip: offset,
      take: limit,
      where: {
        toId: userId,
        accepted: false,
      },
      select: {
        from: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return friends.map((friend) => new FriendProfileDto(friend.from));
  }

  async getBlockList(userId: string) {
    const blocked = await this.prisma.blockedUsers.findMany({
      where: {
        blocked_by_id: userId,
      },
      select: {
        Blocked: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return blocked.map((friend) => new FriendProfileDto(friend.Blocked));
  }

  async getPendingRequests(userId: string, offset: number, limit: number) {
    const friends = await this.prisma.friend.findMany({
      skip: offset,
      take: limit,
      where: {
        fromId: userId,
        accepted: false,
      },
      select: {
        to: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
    return friends.map((friend) => new FriendProfileDto(friend.to));
  }
}
