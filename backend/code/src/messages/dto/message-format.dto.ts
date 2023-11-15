import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Message, User } from '@prisma/client';
import { PICTURE } from 'src/profile/dto/profile.dto';

export class MessageFormatDto {
  Username: any;
  constructor(
    messageData: Message & {
      author: Partial<User>;
      room?: { type: $Enums.RoomType };
    },
    clientMessageId?: string
  ) {
    this.id = messageData.id;
    this.content = messageData.content;
    this.time = messageData.createdAt;
    this.roomId = messageData.roomId;
    this.authorId = messageData.authorId;
    this.Username = messageData.author.Username;
    this.roomType = messageData.room.type;

    // Optional field
    this.clientMessageId = clientMessageId;

    this.avatar = {
      thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${messageData.author.avatar}`,
      medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${messageData.author.avatar}`,
      large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${messageData.author.avatar}`,
    };
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

  @ApiProperty({ example: 'clnx18i8x00003b6lrp84ufb3' })
  avatar: PICTURE;

  @ApiProperty({ example: 'public' })
  roomType: $Enums.RoomType;

  @ApiProperty({ required: false, example: 'XXXXXXXXXXXX' })
  clientMessageId?: string;
}
