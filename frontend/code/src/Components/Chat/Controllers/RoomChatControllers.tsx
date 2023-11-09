import { create } from "zustand";
import users, {
  ChatRoom,
  DmRoom,
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
  currentDmUser: DmRoom;
  currentRoomMessages: Message[];
  isLoading: boolean;
  recentRooms: ChatRoom[];
  recentDms: DmRoom[];

  showChatRooms: boolean;

  setCurrentDmUser: (user: DmRoom) => void;
  setMessageAsFailed: (id: string) => void;
  pushMessage: (message: Message) => void;
  deleteRoom: (id: string) => void;
  fillCurrentMessages: (messages: Message[]) => void;
  fillRecentRooms: (rooms: ChatRoom[]) => void;
  fillRecentDms: (dms: DmRoom[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  selectNewChatID: (id: string) => void;
  editRoom: (name: string, roomType: RoomType, id: string) => void;
  createNewRoom: (name: string, roomType: RoomType, id: string) => void;
  addNewMessage: (message: Message) => void;
  changeChatType: (type: ChatType) => void;
  toggleChatRooms: (value?: boolean) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  selectedChatID: "1",
  selectedChatType: ChatType.Chat,
  recentRooms: chatRooms,
  recentDms: [],
  isLoading: false,
  showChatRooms: false,
  currentDmUser: {
    id: "1",
    secondUserId: "2",
    name: "name",
    avatar: {
      thumbnail: "",
      medium: "",
      large: "",
    },
  },

  // to fix this
  currentMessages: users.find((user) => user.id === "1")?.messages as Message[],
  currentRoomMessages: chatRooms.find((room) => room.id === "1")
    ?.messages as Message[],

  fillRecentDms: (dms: DmRoom[]) => {
    set((state) => {
      state.recentDms = [...dms];
      return { ...state };
    });
  },
  setCurrentDmUser: (user: DmRoom) =>
    set((state) => {
      state.currentDmUser = user;
      return { ...state };
    }),

  setMessageAsFailed: (id: string) =>
    set((state) => {
      const messageIndex = state.currentMessages.findIndex(
        (message) => message.id === id
      );
      if (messageIndex !== -1) {
        state.currentMessages[messageIndex].isFailed = true;
      }
      return { ...state };
    }),

  pushMessage: (message: Message) =>
    set((state) => {
      state.currentMessages = [...state.currentMessages, message];

      return { ...state };
    }),
  fillCurrentMessages: (messages: Message[]) =>
    set((state) => {
      state.currentMessages = [...messages];
      return { ...state };
    }),

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
      if (type === ChatType.Room ) {
        state.selectedChatID = chatRooms.length > 0 ? chatRooms[0].id : "1";
      } else if (type === ChatType.Chat) {
        state.selectedChatID =
          state.recentDms.length > 0 ? state.recentDms[0].id : "1";
      }
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
