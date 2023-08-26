import { Layout } from '../Layout/'
import { Pong } from './assets/Pong'
import { File } from './assets/File'
import { Share } from './assets/ShareB'
import { Message } from './assets/MessageB'
import { Newbie } from './assets/Newbie'
import { Master } from './assets/Master'
import { Ultimate } from './assets/Ultimate'
import Hero from './assets/Hero.gif'
export const Profile = () =>{
    return (
    <Layout>
            <div className='relative  pt-12 h-[37vh] w-[85vw] left-10'>
                <>
                    <img className='absolute  object-contain  rounded-t-3xl' src={Hero} alt="bg hero" />
                    <Pong/>           
                    <div className="avatar w-[10vw] absolute z-40 bottom-0 left-6 sm:left-12 ">
                        <div className="w-[13vw] xl:w-[8vw] rounded-full ring ring-neutral ring-offset-base-100 ring-offset-1">
                            <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="profile avatar" />
                        </div>
                    </div>   
                    {/* <div className='absolute top-12 bg-zinc-800 opacity-20 object-contain h-[60%]  w-full rounded-t-3xl  z-10'></div> */}
                  
                </>
            </div>
            <div className=' relative left-10 flex flex-col gap-y-0 text-neutral z-30 font-montserrat bg-base-200 justify-start pt-10 pl-5 sm:pt-16 xl:pt-28 items-start h-[50vh] w-[85vw] overflow-scroll no-scrollbar'>
                <h6>Mark Zzzz</h6>
                <div className="flex justify-center items-center gap-x-2">
                    <File/>
                    <span className='text-xs font-mono '>bio bla bla bla</span>
                </div>
                <div className=" w-full flex flex-col md:flex-row justify-between items-center gap-x-4 gap-y-2 md:gap-y px-10 py-4  ">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-[12vw] sm:w-[30vw]">
                    <Message/>
                    <Share/>
                    </div>
                    <div className="flex flex-col md:flex-row gap-y-4 justify-center items-center ">
                    <Newbie/>
                    <Master/>
                    <Ultimate/>
                    </div>
                </div>
            </div>
    </Layout>
    )
}