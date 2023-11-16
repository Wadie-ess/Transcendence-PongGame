import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageFormatDto } from './dto/message-format.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { $Enums } from '@prisma/client';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async sendMessages(userId: string, channelId: string, messageDto: any) {
    if (messageDto.content.length > 1000) {
      throw new HttpException('Message is too long', HttpStatus.BAD_REQUEST);
    }

    const room = await this.prisma.room.findUnique({
      where: { id: channelId },
      select: {
        ownerId: true,
        type: true,
        members: {
          where: {
            userId: userId,
          },
        },
      },
    });
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.NOT_FOUND);
    }
    if (room.type === 'dm') {
      const blocked = await this.prisma.blockedUsers.findFirst({
        where: {
          dmRoomId: channelId,
        },
      });
      if (blocked) {
        throw new HttpException(
          'You are blocked from sending messages to this user',
          HttpStatus.FORBIDDEN,
        );
      }
    }

    const roomMember = room.members[0];

    if (!roomMember) {
      throw new HttpException(
        'You are not in this channel',
        HttpStatus.FORBIDDEN,
      );
    }

    if (roomMember.is_banned) {
      throw new HttpException(
        'You are banned from this channel',
        HttpStatus.FORBIDDEN,
      );
    }

    if (roomMember.is_mueted) {
      const now = new Date();
      if (now < roomMember.mute_expires) {
        throw new HttpException(`You are muted for ${Math.round((roomMember.mute_expires.valueOf() - now.valueOf()) / 1000)} seconds`, HttpStatus.FORBIDDEN);
      }
      await this.prisma.roomMember.update({
        where: {
          id: roomMember.id,
        },
        data: {
          is_mueted: false,
          mute_expires: null,
        },
      });
    }

    const messageData = await this.prisma.message.create({
      data: {
        content: messageDto.content,
        roomId: channelId,
        authorId: userId,
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

    const roomMembersIds = await this.prisma.roomMember.findMany({
      where: { roomId: channelId, NOT: { userId } },
      select: { userId: true }
    });
    const blockedUsersIds = await this.prisma.blockedUsers.findMany({
      where: { OR: [{ blocked_by_id: userId }, { blocked_id: userId }] },
      select: { blocked_by_id: true, blocked_id: true }
    });

    const blockedRoomMembersIds = roomMembersIds.filter((member) => {
      return blockedUsersIds.some((blocked) => {
        return blocked.blocked_by_id === member.userId || blocked.blocked_id === member.userId;
      });
    }).map((member) => member.userId);

    const responseMessage: MessageFormatDto = new MessageFormatDto(messageData, messageDto.clientMessageId);
    this.eventEmitter.emit('sendNotification', {
      actorId: userId,
      type: $Enums.NotifType.message,
      entityId: messageData.id,
      entity_type: 'message',
    }, blockedRoomMembersIds.length ? blockedRoomMembersIds : undefined);
    this.eventEmitter.emit('sendMessages', responseMessage, blockedRoomMembersIds.length ? blockedRoomMembersIds : undefined);
    return responseMessage;
  }

  async getMessages(
    userId: string,
    channelId: string,
    offset: number,
    limit: number,
  ) {
    const roomMember = await this.prisma.roomMember.findFirst({
      where: {
        userId,
        roomId: channelId,
      },
    });

    if (!roomMember) {
      throw new HttpException(
        'You are not in this channel',
        HttpStatus.FORBIDDEN,
      );
    }
    const messages = await this.prisma.message.findMany({
      where: {
        roomId: channelId,
        ...(roomMember.is_banned && {
          createdAt: { lte: roomMember.bannedAt },
        }),
      },
      orderBy: {
        createdAt: 'desc',
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
      skip: offset,
      take: limit,
    });

    // get rppm type of room
    const room = await this.prisma.room.findUnique({
      where: {
        id: channelId,
      },
      select: {
        type: true,
      },
    });

    if (room.type === 'dm') {
      const blocked = await this.prisma.blockedUsers.findFirst({
        where: {
          dmRoomId: channelId,
        },
      });
      if (blocked) {
        messages.forEach((message) => {
          if (message.authorId !== userId) {
            message.content = '[REDACTED]';
          }
        });
      }
    } else {
      // get authors ids without duplicats
      const authorsIds = messages.reduce((acc, message) => {
        if (!acc.includes(message.authorId)) {
          acc.push(message.authorId);
        }
        return acc;
      }, []);

      const usersblocked = await this.prisma.blockedUsers.findMany({
        where: {
          id: {
            in: authorsIds.map((id) => [id, userId].sort().join('-')),
          },
        },
      });
      const blockedUsersIds = usersblocked.map((user) =>
        user.id.split('-').find((id) => id !== userId),
      );
      messages.forEach((message) => {
        if (blockedUsersIds.includes(message.authorId)) {
          message.content = '[REDACTED]';
        }
      });
    }
    return messages.map((message) => new MessageFormatDto(message));
  }
}
