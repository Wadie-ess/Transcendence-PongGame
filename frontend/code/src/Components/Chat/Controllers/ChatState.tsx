import { create } from "zustand";
import users, { Message } from "../Components/tools/Assets";


export interface ChatState {
  selectedChatID: number
  currentMessages : Message[]
  selectNewChatID: (id: number) => void
  addNewMessage: (message: Message) => void
}

export const useBearStore = create<ChatState>()((set) => ({
  selectedChatID: 1,
  currentMessages : users.find(user => user.id === 1)?.messages as Message[],
  addNewMessage: (message: Message) => set((state) => {
    const user = users.find(user => user.id === state.selectedChatID)
    if (user) {
      user.messages.push(message)
     
      state.currentMessages = [...user.messages];
      
    }
    return { ...state };
  }),
  selectNewChatID: (id: number) => set( (state) => {
    state.selectedChatID = id
    state.currentMessages = users.find(user => user.id === id)?.messages as Message[]

    return {...state}
  }),
}))

