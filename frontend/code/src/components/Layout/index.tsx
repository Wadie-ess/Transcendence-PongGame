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
import { FC } from 'react'


interface myNodetype  {
    children : React.ReactNode
}
export const Layout : FC<myNodetype> =  (Content) : JSX.Element =>
{
    return (
    <>
        <div data-theme="mytheme" className=' h-screen bg-slate-50 '> 
           
            <div className=' flex flex-row  w-screen h-[8vh] bg-base-200'> 
                <div className='flex justify-start items-center z-50 pl-1  sm:pl-2  h-full w-full'>
                    <Logo/>
                </div>
                <div className='flex items-center  justify-end pr-6 gap-6 h-full w-full'>
                    <Search/>
                    <Alert /> 
                    <Avatar />
                </div>
            </div>
            <div className='flex'>
           
            <div className='sm:flex flex-col hidden justify-around items-stretch h-[92vh] bg-base-200  sm:w-[11vw]  md:w-[9vw] xl:w-[7vw]'>
                <div className="flex flex-col pl-[1.4vw] justify-evenly content-start gap-y-10 pb-44 ">
                    <Dash/>
                    <Game/>
                    <Message/>
                    <Profile/>
                    <Settings/>
                </div>
                <div className="flex flex-col pl-[1vw] justify-start content-sType '{ children: Element; }' has no properties in common with type 'IntrinsicAttributes'.ts(2559)
tart ">
                    <Out/>
                </div>
            </div>
                <div className=" h-[8vh] fixed bottom-0 sm:hidden btm-nav bg-base-200 flex justify-end z-50">
                    <button className="">
                        <Dash/>                    
                    </button>
                    <button className="">
                        <Game/>                    
                    </button>
                    <button className="">
                        <Message/>                    
                    </button>
                    <button className="">
                        <Profile/>                    
                    </button>
                    <button className="">
                        <Settings/>                    
                    </button>
                </div>
                <div className='sm:-ml-4 sm:w-[92vw] xl:w-[95vw] md:w-[93.5vw] w-screen right-0 z-10 h-[84vh] sm:h-[92vh]  bg-base-100 sm:rounded-tl-2xl  overflow-auto no-scrollbar'>
                    {Content.children}
                </div>
            </div>
        </div>
    </>
    )
}