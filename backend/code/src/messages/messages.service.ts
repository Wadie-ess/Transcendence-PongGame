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
  ) {}

  async sendMessages(userId: string, channelId: string, messageDto: any) {
    console.log(messageDto);
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
          'You are blocked from this dm',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }

    const roomMember = room.members[0];

    if (!roomMember) {
      throw new HttpException(
        'User is not in channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (roomMember.is_banned) {
      throw new HttpException(
        'you are banned from this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (roomMember.is_mueted) {
      const now = new Date();
      if (now < roomMember.mute_expires) {
        throw new HttpException('User is muted', HttpStatus.UNAUTHORIZED);
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

    const responseMessage: MessageFormatDto = new MessageFormatDto(messageData, messageDto.clientMessageId);
    this.eventEmitter.emit('sendNotification', {
      actorId: userId,
      type: $Enums.NotifType.message,
      entityId: messageData.id,
      entity_type: 'message',
    });
    this.eventEmitter.emit('sendMessages', responseMessage);
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
        'User is not in channel',
        HttpStatus.UNAUTHORIZED,
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
            message.content = '[REDUCTED]';
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
          message.content = '[REDUCTED]';
        }
      });
    }
    return messages.map((message) => new MessageFormatDto(message));
  }
}
