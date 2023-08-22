import { Logo } from './Assets/Logo'
import { Alert } from './Assets/Alert'
import { Avatar } from './Assets/Avatar'
import {BiSearch} from 'react-icons/bi'
export const Layout =  () =>
{
    return (
    <>
        <div className='fixed h-screen bg-slate-50 '> 
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
            <div className='absolute right-0 w-screen sm:w-[90vw] md:w-[91vw] xl:w-[94vw] h-screen z-10 bg-base-100 sm:rounded-tl-3xl'></div>
        </div>
    </>
    )
}