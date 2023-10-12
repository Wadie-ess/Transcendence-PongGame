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
    if (messageDto.content.length > 1000) {
      throw new HttpException('Message is too long', HttpStatus.BAD_REQUEST);
    }

    //TODO: check user is not banned
    // check user is in channel
    // check user is not muted
    //FIXME: owner room memebr
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
    });
    const responseMessage: MessageFormatDto = new MessageFormatDto(messageData);
    this.eventEmitter.emit('sendMessages', responseMessage);
    return responseMessage;
  }
}
