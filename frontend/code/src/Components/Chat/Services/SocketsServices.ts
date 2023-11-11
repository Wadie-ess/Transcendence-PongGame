import {  io } from 'socket.io-client';
import { create } from 'zustand'


const reconnect = () => {
  return io("http://localhost:3004", {
                    transports: ['websocket'],
                });
}
export const useSocketStore:any = create((set:any) => ({
    socket:null,
    connected:false,
    setSocket : () => {
      
        var s:any;
        
        const soc = set((state:any) => {
          if (state.socket === null){
            s = io("http://localhost:3004", {
              transports: ['websocket'],
              'reconnection': true,
              'reconnectionDelay': 1000,
              'reconnectionDelayMax' : 1000,
              'reconnectionAttempts': 5
            });
            
           
            s.on('connect_error', async() => {
              await new Promise(r => setTimeout((r) => {
                console.log("inside");
                s = reconnect();
                s.on('connect' , () => {console.log("connected")}
              )
            },1000))
              });
            return {socket:s}
          }
          return state
        })
        return soc ? soc : s;
        
    }}))

