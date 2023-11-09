import { useSocketStore } from "../../Chat/Services/SocketsServices"
import { useState } from "react";
export const Modal = () => {
    const [opacity , setOpacity] = useState("");
    const [timer , setTimer] = useState(0)
    const socketStore = useSocketStore();
    if (socketStore.socket !== null){
        socketStore.socket.on("timer",(msg:any) => {
            msg !== 0 && setOpacity("opacity-100")
            msg === 0 && setOpacity("opacity-0")
            setTimer(msg / 1000)
        })
    }
    return (

          
            <div className={`modal ${opacity}`}>
            <div className="modal-box">
                <h3 className="text-lg font-bold">Game Starting .... </h3>
                <p className="py-4 flex items-center justify-center text-xl font-poppins font-bold">Game Start In {timer}</p>
            </div>
            </div>
        )
}