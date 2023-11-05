import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PICTURE } from 'src/profile/dto/profile.dto';

export class FriendProfileDto {
  constructor(friend: Partial<User>) {
    this.userId = friend?.userId;
    this.firstname = friend?.firstName;
    this.lastname = friend?.lastName;
    this.avatar = {
      thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${friend.avatar}`,
      medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${friend.avatar}`,
      large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${friend.avatar}`,
    };
  }

  @ApiProperty({ example: 'cloh36sfy00002v6laxvhdj7r' })
  userId: string;
  @ApiProperty({ example: 'John' })
  firstname: string;
  @ApiProperty({ example: 'Doe' })
  lastname: string;
  @ApiProperty({
    example: {
      thumbnail:
        'https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/cloh36sfy00002v6laxvhdj7r',
      medium:
        'https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/cloh36sfy00002v6laxvhdj7r',
      large:
        'https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/cloh36sfy00002v6laxvhdj7r',
    },
  })
  avatar: PICTURE;
}
