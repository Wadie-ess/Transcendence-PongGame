import { create } from "zustand";
import users, { Message } from "../Components/tools/Assets";

export enum ChatType {
  Chat,
  Room,
}

export interface ChatState {
  selectedChatType: ChatType;
  selectedChatID: number;
  currentMessages: Message[];
  selectNewChatID: (id: number) => void;
  addNewMessage: (message: Message) => void;
  changeChatType: (type: ChatType) => void;
}

export const useBearStore = create<ChatState>()((set) => ({
  selectedChatID: 1,
  selectedChatType: ChatType.Chat,

  currentMessages: users.find((user) => user.id === 1)?.messages as Message[],
  changeChatType: (type: ChatType) =>
    set((state) => {
      state.selectedChatType = type;
      return { ...state };
    }),
  addNewMessage: (message: Message) =>
    set((state) => {
      const user = users.find((user) => user.id === state.selectedChatID);
      if (user) {
        user.messages.push(message);

        state.currentMessages = [...user.messages];
      }
      return { ...state };
    }),
  selectNewChatID: (id: number) =>
    set((state) => {
      state.selectedChatID = id;
      state.currentMessages = users.find((user) => user.id === id)
        ?.messages as Message[];

      return { ...state };
    }),
}));
