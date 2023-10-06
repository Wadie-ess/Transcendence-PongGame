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
};

export interface Message {
  senderId: number;
  message: string;
  time: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  messages: Message[];
  usersId: number[];
  isOwner: boolean;
  isAdmin: boolean;
}

export interface User {
  id: number;
  name: string;
  image: string;
  messages: Message[];
}

// chat rooms dummy data
export const chatRooms: ChatRoom[] = [
  {
    id: 1,
    name: "Room 1",
    messages: [
      {
        senderId: 5,
        message: "Hello, everyone!",
        time: "10:00 AM",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 7,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 3,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      // Add more messages for Room 1 here
    ],
    usersId: [1, 2, 3, 4, 5, 6, 7],
    isOwner: true,
    isAdmin: true,
  },
  {
    id: 2,
    name: "Room 2",
    messages: [
      {
        senderId: 2,
        message: "Hey, Room 2!",
        time: "11:00 AM",
        isRead: true,
      },
      {
        senderId: 1,
        message: "Hello from Room 1!",
        time: "11:05 AM",
        isRead: false,
      },
      // Add more messages for Room 2 here
    ],
    usersId: [1, 2, 3,  7], // User IDs participating in the chat room
    isOwner: false,
    isAdmin: false,
  },
  {
    id: 3,
    name: "Room 3",
    messages: [
      {
        senderId: 5,
        message: "Hello, everyone!",
        time: "10:00 AM",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 7,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 3,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      // Add more messages for Room 1 here
    ],
    usersId: [1, 2], // User IDs participating in the chat room
    isOwner: true,
    isAdmin: true,
  },
  {
    id: 4,
    name: "Room 4",
    messages: [
      {
        senderId: 5,
        message: "Hello, everyone!",
        time: "10:00 AM",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 7,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 3,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      // Add more messages for Room 1 here
    ],
    usersId: [1, 2], // User IDs participating in the chat room
    isOwner: true,
    isAdmin: true,
  },
  {
    id: 5,
    name: "Room 5",
    messages: [
      {
        senderId: 5,
        message: "Hello, everyone!",
        time: "10:00 AM",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 7,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 3,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      // Add more messages for Room 1 here
    ],
    usersId: [1, 2], // User IDs participating in the chat room
    isOwner: true,
    isAdmin: true,
  },
  {
    id: 6,
    name: "Room 6",
    messages: [
      {
        senderId: 5,
        message: "Hello, everyone!",
        time: "10:00 AM",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 7,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 3,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      // Add more messages for Room 1 here
    ],
    usersId: [1, 2], // User IDs participating in the chat room
    isOwner: true,
    isAdmin: true,
  },
  {
    id: 7,
    name: "Room 7",
    messages: [
      {
        senderId: 5,
        message: "Hello, everyone!",
        time: "10:00 AM",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 7,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      {
        senderId: 3,
        message: "Hi there!",
        time: "10:05 AM",
        isRead: true,
      },
      // Add more messages for Room 1 here
    ],
    usersId: [1, 2], // User IDs participating in the chat room
    isOwner: true,
    isAdmin: true,
  },
  // Add more chat rooms here
];

// joined chatRooms dummy data
export const chatRoomsJoinedIds = [
  {
    id: 1,
    isAdmin: true,
    isOwner: true,
  },
  {
    id: 2,
    isAdmin: false,
    isOwner: false,
  },
  {
    id: 3,
    isAdmin: false,
    isOwner: true,
  },
];

export const users: User[] = [
  {
    id: 1,
    name: "User 1",
    image: yas,
    messages: [
      {
        senderId: 1,
        message: "Hello!",
        time: "00:00",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "05:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "Hello!",
        time: "00:00",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "05:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "Hello!",
        time: "00:00",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "05:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "Hello!",
        time: "00:00",
        isRead: true,
      },
      {
        senderId: 2,
        message: "Hi there!",
        time: "05:00",
        isRead: true,
      },
      // Add more messages as needed
    ],
  },
  {
    id: 2,
    name: "User 2",
    image: yas2,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      // Add more messages as needed
    ],
  },
  {
    id: 3,
    name: "User 3",
    image: yas,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      // Add more messages as needed
    ],
  },
  {
    id: 4,
    name: "User 4",
    image: yas3,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      // Add more messages as needed
    ],
  },
  {
    id: 5,
    name: "User 5",
    image: yas4,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      // Add more messages as needed
    ],
  },
  {
    id: 6,
    name: "User 6",
    image: yas5,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },

      // Add more messages as needed
    ],
  },
  {
    id: 7,
    name: "User 7",
    image: yas5,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },

      // Add more messages as needed
    ],
  },
  {
    id: 8,
    name: "User 8",
    image: yas5,
    messages: [
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
        message: "How are you?",
        time: "15:00",
        isRead: false,
      },
      {
        senderId: 2,
        message: "Hey!",
        time: "10:00",
        isRead: true,
      },
      {
        senderId: 1,
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
