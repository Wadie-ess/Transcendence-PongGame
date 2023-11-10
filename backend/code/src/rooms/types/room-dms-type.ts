import { PICTURE } from 'src/profile/dto/profile.dto';

export type DMsData = {
  id: string;
  name: string;
  last_message: {
    createdAt: Date;
    content: string;
  } | null;
  secondMemberId: string;
  avatar: PICTURE;
};
