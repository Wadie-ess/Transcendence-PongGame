import { create } from "zustand";
import users, { Message, chatRooms } from "../Components/tools/Assets";

export enum ChatType {
  Chat,
  Room,
}

export interface ChatState {
  selectedChatType: ChatType;
  selectedChatID: number;
  currentMessages: Message[];
  currentRoomMessages: Message[];
  selectNewChatID: (id: number) => void;
  addNewMessage: (message: Message) => void;
  changeChatType: (type: ChatType) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  selectedChatID: 1,
  selectedChatType: ChatType.Chat,

  currentMessages: users.find((user) => user.id === 1)?.messages as Message[],
  currentRoomMessages: chatRooms.find((room) => room.id === 1)
    ?.messages as Message[],

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
  selectNewChatID: (id: number) =>
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
