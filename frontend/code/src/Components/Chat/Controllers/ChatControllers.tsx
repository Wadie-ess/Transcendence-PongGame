import { create } from "zustand";
import users, {
  ChatRoom,
  Message,
  RoomType,
  chatRooms,
} from "../Components/tools/Assets";

export enum ChatType {
  Chat,
  Room,
}

export interface ChatState {
  selectedChatType: ChatType;
  selectedChatID: string;
  currentMessages: Message[];
  currentRoomMessages: Message[];

  recentRooms: ChatRoom[];
  selectNewChatID: (id: string) => void;
  createNewRoom: (name: string, roomType: RoomType, id: string) => void;
  addNewMessage: (message: Message) => void;
  changeChatType: (type: ChatType) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  selectedChatID: "1",
  selectedChatType: ChatType.Chat,
  recentRooms: chatRooms,
  // to fix this 
  currentMessages: users.find((user) => user.id === "1")?.messages as Message[],
  currentRoomMessages: chatRooms.find((room) => room.id === "1")
    ?.messages as Message[],

  createNewRoom: (name: string, roomType: RoomType, id: string) =>
    set((state) => {
      const newRoom = {
        id: id,
        name: name,
        type: roomType,
        messages: [],
        usersId: [] as string[],
        isOwner: false,
        isAdmin: false,
      };
    
      chatRooms.push(newRoom);
      state.recentRooms = [...chatRooms];
      return { ...state };
    }),
  changeChatType: (type: ChatType) =>
    set((state) => {
      state.selectedChatType = type;
      return { ...state };
    }),
  addNewMessage: (message: Message) =>
    set((state) => {
      if (state.selectedChatType === ChatType.Room) {
        const room = chatRooms.find((room) => room.id === state.selectedChatID);
        if (room) {
          room.messages.push(message);

          state.currentRoomMessages = [...room.messages];
        }
        return { ...state };
      }
      const user = users.find((user) => user.id === state.selectedChatID);
      if (user) {
        user.messages.push(message);

        state.currentMessages = [...user.messages];
      }
      return { ...state };
    }),
  selectNewChatID: (id: string) =>
    set((state) => {
      if (state.selectedChatType === ChatType.Room) {
        state.currentRoomMessages = chatRooms.find((room) => room.id === id)
          ?.messages as Message[];
        state.selectedChatID = id;
        return { ...state };
      }
      state.selectedChatID = id;
      state.currentMessages = users.find((user) => user.id === id)
        ?.messages as Message[];

      return { ...state };
    }),
}));
