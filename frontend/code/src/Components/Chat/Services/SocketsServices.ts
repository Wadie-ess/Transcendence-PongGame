import {  io } from 'socket.io-client';
import { create } from 'zustand'

interface SocketStore {
  socket: any;
  connected: boolean;

  setSocket: () => any;
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  socket: null,
  connected: false,
  setSocket: () => {
    let newSocket: any = null;

    set((state) => {
      if (state.socket === null) {
        newSocket = io("http://localhost:3004", {
          transports: ['websocket'],
          'reconnection': true,
          'reconnectionDelay': 1000,
          'reconnectionDelayMax': 1000,
          'reconnectionAttempts': 5
        });

        // Set socket
        set({ ...state, socket: newSocket });

        newSocket.on('connect', () => {
          console.log('Connected!');
          // Set connected state
          set({ ...state, connected: true });
        });

        newSocket.on('connect_error', async () => {
          await new Promise((resolve) => setTimeout(() => {
            // Set connected state
            set({ ...state, connected: false });
            newSocket.connect();
            resolve(newSocket);
          }, 1000))
        });

        return { ...state, socket: newSocket };
      }

      return state;
    });

    return newSocket;
  }
}))

