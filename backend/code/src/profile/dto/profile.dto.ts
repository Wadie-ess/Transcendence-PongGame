import { ApiProperty } from '@nestjs/swagger';
import { Friend, Room, RoomMember, User } from '@prisma/client';

type ProfileDtoProps = Partial<User> &
  Partial<{
    left_friends: Friend[];
    right_friends: Friend[];
    roomMember: RoomMember[];
    owned_rooms: Room[];
  }>;
/*
    isLogged: boolean,
    id:string,
    bio:string,
    phone:string,
    name:{
        first:string,
        last:string
    },
    picture:{
        thumbnail:string,
        medium:string,
        large:string
    },
    email:string,
    tfa:boolean,
*/

type NAME = {
  first: string;
  last: string;
};

type PICTURE = {
  thumbnail: string;
  medium: string;
  large: string;
};

export class ProfileDto {
  constructor(userData: ProfileDtoProps) {
    this.id = userData.userId;
    this.profileFinished = userData.profileFinished;
    this.tfa = userData.tfaEnabled;
    this.name = {
      first: userData.firstName,
      last: userData.lastName,
    };
    this.bio = userData.discreption;
    this.phone = '0000000000';
    this.email = userData.email;
    this.picture = {
      thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${userData.avatar}`,
      medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${userData.avatar}`,
      large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${userData.avatar}`,
    };
  }

  @ApiProperty({ example: 'cln8xxhut0000stofeef' })
  id: string;
  @ApiProperty({ example: true })
  profileFinished: boolean;
  @ApiProperty({ example: true })
  tfa: boolean;
  @ApiProperty({ example: { first: 'John', last: 'Doe' } })
  name: NAME;
  @ApiProperty({ example: 'I am a student' })
  bio: string;
  @ApiProperty({ example: '0000000000' })
  phone: string;
  @ApiProperty({
    example: {
      thumbnail:
        'https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/cln8xxhut0000stofeef.jpg',
      medium:
        'https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/cln8xxhut0000stofeef.jpg',
      large:
        'https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/cln8xxhut0000stofeef.jpg',
    },
  })
  picture: PICTURE;
  @ApiProperty({ example: 'example@mail.com' })
  email: string;
}
