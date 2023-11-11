import { useSocketStore } from "../../Chat/Services/SocketsServices"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export const Modal = () => {
    const [opacity , setOpacity] = useState("");
    var gameId:string;
    const [timer , setTimer] = useState<undefined | number>(undefined)
    const [gameid , setGameId] = useState<undefined | string>(undefined);
    const socketStore = useSocketStore();
    const navigate = useNavigate();
    if (socketStore.socket !== null){
        socketStore.socket.on("game.launched" , (GameId:any) => {
            setGameId(GameId.slice(5))
        })
        socketStore.socket.on("timer",(msg:any) => {
            msg !== 0 && setOpacity("opacity-100")
            msg === 0 && setOpacity("opacity-0")
            setTimer(msg / 1000)
            if (timer === 5){
                navigate(`/Game/${gameid}`)
                }
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