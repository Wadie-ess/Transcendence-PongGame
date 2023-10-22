import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@prisma/client';

export class MessageFormatDto {
  constructor(messageData: Message) {
    this.id = messageData.id;
    this.content = messageData.content;
    this.time = messageData.createdAt;
    this.roomId = messageData.roomId;
    this.authorId = messageData.authorId;
  }

  @ApiProperty({ example: 'clnx16e7a00003b6moh6yipir' })
  id: string;
  @ApiProperty({ example: 'Hello World' })
  content: string;
  @ApiProperty({ example: '2021-08-16T14:00:00.000Z' })
  time: Date;
  @ApiProperty({ example: 'clnx17wal00003b6leivni4oe' })
  roomId: string;
  @ApiProperty({ example: 'clnx18i8x00003b6lrp84ufb3' })
  authorId: string;
}
