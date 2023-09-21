import { Friend, Room, RoomMember, User } from '@prisma/client';

type ProfileDtoProps = Partial<User> &
  Partial<{
    left_friends: Friend[];
    right_friends: Friend[];
    roomMember: RoomMember[];
    owned_rooms: Room[];
  }>;

export class ProfileDto {
  constructor(userData: ProfileDtoProps) {
    this.id = userData.userId;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.profileFinished = userData.profileFinished;
    this.tfa = userData.tfaEnabled;
    if (userData.left_friends && userData.right_friends) {
      this.friends = [...userData.left_friends, ...userData.right_friends];
    }
  }

  id: string;
  firstName: string;
  lastName: string;
  profileFinished: boolean;
  tfa: boolean;
  friends?: Friend[];
  dmsIds: number[];
}
