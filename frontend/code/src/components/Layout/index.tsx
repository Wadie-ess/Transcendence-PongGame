import { Logo } from './Assets/Logo'
import { Alert } from './Assets/Alert'
import { Avatar } from './Assets/Avatar'
import { Search } from './Assets/Search'
import { Dash } from './Assets/Dash'
import { Game } from './Assets/Game'
import { Message } from './Assets/Message'
import { Profile } from './Assets/Profile'
import { Settings } from './Assets/Settings'
import { Out } from './Assets/Out'

let props  = {
    width :42,
    height:6
}
export const Layout =  () =>
{
    return (
    <>
        <div data-theme="mytheme" className=' h-screen bg-slate-50 '> 
           
            <div className=' flex flex-row  w-screen h-[8vh] bg-base-200'> 
                <div className='flex justify-start z-50 pl-6 items-start h-full w-full'>
                    <Logo/>
                </div>
                <div className='flex items-center  justify-end pr-6 gap-6 h-full w-full'>
                    <Search w={props.width} h={props.height}/>
                    <Alert /> 
                    <Avatar />
                </div>
            </div>
            <div className='flex'>
           
            <div className='sm:flex flex-col hidden justify-around items-stretch h-screen bg-base-200  w-[8vw]'>
                <div className="flex flex-col pl-[1vw] justify-evenly content-start gap-y-10 ">
                    <Dash/>
                    <Game/>
                    <Message/>
                    <Profile/>
                    <Settings/>
                </div>
                <div className="flex flex-col pl-[1vw] justify-start content-start ">
                    <Out/>
                </div>
            </div>
                <div className=" h-[8vh] sm:hidden btm-nav bg-base-200 hover:stroke-red-400">
                    <button className="text-primary ">
                        <svg className="hover:stroke-red-400 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    </button>
                    <button className="text-primary ">
                        <svg className="hover:stroke-red-400 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <button className="text-primary">
                        <svg className="hover:stroke-red-400 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </button>
                </div>
                <div className='sm:absolute sm:w-[94vw] w-screen right-0 z-10 h-[84vh] sm:h-screen  bg-base-100 sm:rounded-tl-2xl '></div>
            </div>
        </div>
    </>
    )
}