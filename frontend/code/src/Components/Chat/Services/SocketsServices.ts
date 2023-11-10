import {  io } from 'socket.io-client';
import { create } from 'zustand'

export const useSocketStore:any = create((set:any) => ({
    socket:null,
    setSocket : () => {
        
        const s = io("http://localhost:3004", {
        transports: ['websocket'],
        withCredentials: true,
        });
        set(() => ({socket:s}))
        return s;
    }
    }))

