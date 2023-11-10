import { VsBot } from './assets/VsBot'
import { useSocketStore } from '../Chat/Services/SocketsServices'
import toast from 'react-hot-toast'
export const Play = () => {
    const socketStore = useSocketStore();
    const subscribeToGame = async() => {
        // socketStore.socket.emit
        try {
            socketStore.socket.emit("startGame");
            toast.success("Match making in Progress you can move until find opponent"
            ,{
                duration:5000
            })
        } catch (error) {
            toast.error("can not start game")          
        }
    }
    return(
        <>
            <div className="flex flex-col sm:flex-row justify-center items-center  sm:justify-center sm:items-start p-10 gap-x-20">
            <div onClick={subscribeToGame} className='max-w-[55vw] max-h-[55vh]  w-[100%]'><VsBot/></div>
            {/* <div className='max-w-[55vw] max-h-[55vh]  w-[100%]'><VsUser/></div> */}
           
            {/* </div>
            <h1 className='text-3xl font-poppins font-bold text-neutral text-center '>OR</h1>
            <div className="flex flex-col sm:flex-row justify-center items-center  sm:justify-center sm:items-start p-10 gap-x-20">
                <div className='max-w-[55vw] max-h-[55vh] sm:max-w-[45vw] sm:max-h-[45vh]  w-[100%]'><Watch/></div> */}
           </div>
        </>
    )
}