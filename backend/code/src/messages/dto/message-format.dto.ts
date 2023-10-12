import { Message } from '@prisma/client';

export class MessageFormatDto {
  constructor(messageData: Message) {
    this.id = messageData.id;
    this.content = messageData.content;
    this.time = messageData.createdAt;
    this.roomId = messageData.roomId;
    this.authorId = messageData.authorId;
  }
  id: string;
  content: string;
  time: Date;
  roomId: string;
  authorId: string;
}
