import { VsUser } from './assets/VsUser'
import { VsBot } from './assets/VsBot'
import { Watch } from './assets/Watch'
import { Link } from 'react-router-dom'
export const Play = () => {
    return(
        <>
            <div className="flex flex-col sm:flex-row justify-center items-center  sm:justify-center sm:items-start p-10 gap-x-20">
            <div className='max-w-[55vw] max-h-[55vh]  w-[100%]'><Link to={"/Game"} ><VsBot/></Link></div>
            <div className='max-w-[55vw] max-h-[55vh]  w-[100%]'><VsUser/></div>
           
            </div>
            <h1 className='text-3xl font-poppins font-bold text-neutral text-center '>OR</h1>
            <div className="flex flex-col sm:flex-row justify-center items-center  sm:justify-center sm:items-start p-10 gap-x-20">
                <div className='max-w-[55vw] max-h-[55vh] sm:max-w-[45vw] sm:max-h-[45vh]  w-[100%]'><Watch/></div>
           </div>
        </>
    )
}