import { Logo } from './Assets/Logo'
import { Alert } from './Assets/Alert'
import { Avatar } from './Assets/Avatar'
import {BiSearch} from 'react-icons/bi'


export const Layout =  () =>
{
    return (
    <>
        <div data-theme="mytheme" className='fixed h-screen bg-slate-50 '> 
            <div className=' flex items-center content-around gap-x-8 sm:gap-x-6 justify-end pr-8  p-2 w-screen h-18 bg-base-200'> 
                <Logo />
                <div className='hidden sm:flex sm:items-center '>
                    <input type="text" placeholder="Search" className=" absolute right-40 input w-72 mr-4 h-10 max-w-xs"/>
                    <div className='relative left-0 top-0 w-12 '><BiSearch size="1.4em" /></div>
                </div>
                <Alert /> 
                <Avatar />
            </div>
            
            <div className='sm:fixed hidden sm:block h-screen bg-base-200 min-w-full max-w-[9%] w-20  '></div>
            <div className=" sm:hidden btm-nav bg-base-200 hover:stroke-red-400">
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
            <div className='absolute h-[86%] sm:h-screen right-0 w-screen sm:w-[90vw] md:w-[91vw] xl:w-[94vw]  z-10 bg-base-100 sm:rounded-tl-3xl'></div>
        
        </div>
    </>
    )
}