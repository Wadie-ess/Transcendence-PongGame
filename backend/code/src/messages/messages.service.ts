import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageFormatDto } from './dto/message-format.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

    const responseMessage: MessageFormatDto = new MessageFormatDto(messageData);
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
    //TESTING: for later testing
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

    return messages.map((message) => new MessageFormatDto(message));
  }
}
