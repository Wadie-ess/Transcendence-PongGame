import UserImage from "../../assets/aymane.png";
import yas from "../../assets/alaoui.png";
import yas1 from "../../assets/alaoui.png";
import yas2 from "../../assets/3.png";
import yas3 from "../../assets/4.png";
import yas4 from "../../assets/5.png";
import yas5 from "../../assets/6.png";
import SearchIcon from "../../assets/Search_icon.svg";
import EditIcon from "../../assets/Edit_icon.svg";
import More from "../../assets/more_icon.svg";
import Send from "../../assets/send_icon.svg";
import Close from "../../assets/close_icon.svg";
import Bio from "../../assets/bio_icon.svg";
import check from "../../assets/check_icon.svg";
import groupIcon from "../../assets/groupChat.svg";
import GroupChat from "../../assets/CreateGroupChat.svg";
import NullImage from "../../assets/null_asset.svg";
import ChatIcon from "../../assets/Chat.svg";
import RoomsIcon from "../../assets/group_share.svg";
import Explore from "../../assets/explore.svg";
import owner from "../../assets/owner.svg";
import Lock from "../../assets/lockIcon.svg";
import Unlock from "../../assets/UnlockIcon.svg";
import ChatGif from "../../assets/chatGif.gif";
import NullUser from "../../assets/User_duotone.svg";
export enum RoomType {
  private,
  public,
  protected,
}

export {
  UserImage,
  yas,
  yas1,
  yas2,
  yas3,
  yas4,
  yas5,
  SearchIcon,
  EditIcon,
  More,
  Send,
  Close,
  Bio,
  check,
  GroupChat,
  NullImage,
  RoomsIcon,
  ChatIcon,
  groupIcon,
  Explore,
  Lock,
  Unlock,
  ChatGif,
  NullUser,
  owner,
};

export interface Message {
  id?: string;
  roomId?: string;
  senderId: string;
  message: string;
  time: string;
  isRead?: boolean;
}

export interface RoomMember {
  id: string;
  firstname: string;
  lastname: string;
  avatar: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  isBaned?: boolean;
  isMuted?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  messages: Message[];
  usersId: string[];
  isOwner: boolean;
  isAdmin: boolean;
  type: RoomType;
  membersCount?: number;
}

export interface User {
  firstName?: string;
  lastName?: string;
  id: string;
  name: string;
  image: string;
  imageLInk?: string;
  messages: Message[];
}

// chat rooms dummy data
export const chatRooms: ChatRoom[] = [];

export const users: User[] = [
  {
    id: "1",
    name: "User 1",
    image: yas,
    messages: [
      {
        senderId: "1",
        message: "Hello!",
        time: "00:00",
        isRead: true,
      },
      {
        senderId: "2",
        message: "Hi there!",
        time: "05:00",
        isRead: true,
      },

      // Add more messages as needed
    ],
  },
  {
    id: "2",
    name: "User 2",
    image: yas2,
    messages: [
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },

      // Add more messages as needed
    ],
  },
  {
    id: "3",
    name: "User 3",
    image: yas,
    messages: [
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },

      // Add more messages as needed
    ],
  },
  {
    id: "8",
    name: "User 4",
    image: yas,
    messages: [
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },

      // Add more messages as needed
    ],
  },
  {
    id: "9",
    name: "User 5",
    image: yas,
    messages: [
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: "2",
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: "1",
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },

      // Add more messages as needed
    ],
  },

  // Add more users as needed
];

export default users;
