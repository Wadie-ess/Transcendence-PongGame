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
  isLoading: boolean;

  showChatRooms: boolean;

  recentRooms: ChatRoom[];
  deleteRoom: (id: string) => void;
  fillRecentRooms: (rooms: ChatRoom[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  selectNewChatID: (id: string) => void;
  editRoom: (name: string, roomType: RoomType, id: string) => void;
  createNewRoom: (name: string, roomType: RoomType, id: string) => void;
  addNewMessage: (message: Message) => void;
  changeChatType: (type: ChatType) => void;
  toggleChatRooms: (value?: boolean) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  selectedChatID: chatRooms.length > 0 ? chatRooms[0].id : "1",
  selectedChatType: ChatType.Chat,
  recentRooms: chatRooms,
  isLoading: false,

  // UI state
  showChatRooms: false,

  // to fix this
  currentMessages: users.find((user) => user.id === "1")?.messages as Message[],
  currentRoomMessages: chatRooms.find((room) => room.id === "1")
    ?.messages as Message[],

  deleteRoom: (id: string) =>
    set((state) => {
      const roomIndex = chatRooms.findIndex((room) => room.id === id);
      if (roomIndex !== -1) {
        chatRooms.splice(roomIndex, 1);
      }

      state.recentRooms = [...chatRooms];
      if (state.recentRooms.length > 0)
        state.selectedChatID = state.recentRooms[0].id;
      else state.selectedChatID = "1";

      return { ...state };
    }),
  setIsLoading: (isLoading: boolean) =>
    set((state) => {
      state.isLoading = isLoading;
      return { ...state };
    }),
    
  fillRecentRooms: (rooms: ChatRoom[]) =>
    set((state) => {
      chatRooms.length = 0;
      chatRooms.push(...rooms);
      state.recentRooms = [...chatRooms];
      if (state.recentRooms.length > 0 && state.selectedChatID === "1")
        state.selectedChatID = state.recentRooms[0].id;

      return { ...state };
    }),

  editRoom: (name: string, roomType: RoomType, id: string) =>
    set((state) => {
      const room = chatRooms.find((room) => room.id === id);
      if (room) {
        room.name = name;
        room.type = roomType;
      }
      state.selectedChatID = id;
      state.recentRooms = [...chatRooms];
      return { ...state };
    }),
  createNewRoom: (name: string, roomType: RoomType, id: string) =>
    set((state) => {
      const newRoom = {
        id: id,
        name: name,
        type: roomType,
        messages: [],
        usersId: [] as string[],
        isOwner: true,
        isAdmin: true,
      };
      state.selectedChatID = id;

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

  toggleChatRooms: (value?: boolean) =>
    set((state) => ({
      ...state,
      showChatRooms: value === undefined ? !state.showChatRooms : value,
    })),
}));
