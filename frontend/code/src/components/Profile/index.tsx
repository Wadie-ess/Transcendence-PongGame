import { Layout } from '../Layout/'
import { Pong } from './assets/Pong'
import { File } from './assets/File'
import { Share } from './assets/ShareB'
import { Message } from './assets/MessageB'
import { Newbie } from './assets/Newbie'
import { Master } from './assets/Master'
import { Ultimate } from './assets/Ultimate'
import { History } from './History'
import Hero from './assets/Hero.gif'
import { useState , useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../Loading'
export const Profile = () =>{
    const params = useParams()
    const [user, setUser] = useState<null | any>(undefined);
    useEffect(() => {
        const fetchUser = async() => {
            const response = await fetch(`https://randomuser.me/api?seed=${params.id}`)
            const data = await response.json();
            const collecteduser = data.results[0]
            console.log(collecteduser)
            setUser(collecteduser)
        }
        fetchUser();
    },[params])
    return (
    <Layout>
        <div className=" flex flex-col items-center h-full min-h-screen">
            <div className='relative pt-12 h-auto max-h-[30vh] w-[85vw]'>
               
                <img className='flex-1   w-full h-full  rounded-t-3xl' src={Hero} alt="bg hero" />
                <Pong/>           
                <div className="avatar w-[10vw] absolute z-40 -bottom-4 sm:-bottom-6 md:-bottom-11 left-6 sm:left-12 ">
                    <div className="w-[13vw] xl:w-[8vw] rounded-full ring ring-neutral flex justify-center items-center ring-offset-base-100 ring-offset-1">
                        {
                            user?.picture?.large ? <img src={user?.picture?.large} alt="profile avatar" />: <Loading/>
                        }
                        
                    </div>
                </div>   
                <div className='absolute top-0 bg-gray-300-80 opacity-40 object-contain h-full  w-full rounded-t-3xl  z-10'></div>
                  
               
            </div>
            <div className='relative flex flex-col gap-y-2 sm:gap-y-0 pl-4 sm:pt-12 pt-6 text-neutral font-montserrat bg-base-200  justify-start  items-start h-[35%] min-h-[30%] rounded-b-3xl w-[85vw] overflow-scroll no-scrollbar'>
                    {
                            user?.name?.first ? <h6>{user?.name?.first} </h6>: <Loading/>
                    }                <div className="flex justify-center items-center gap-x-2">
                    <File/>
                    <span className='text-xs font-mono '>bio bla bla bla</span>
                </div>
                <div className="  w-full flex flex-col  sm:flex-row justify-between items-center gap-x-4  h-2/6">
                    <div className="flex flex-col gap-y-2 flex-0 sm:flex-row sm:gap-x-4 justify-center items-center sm:justify-start sm:items-start  sm:w-[25vw]">
                        <Message/>
                        <Share/>
                    </div>
                    <div className="flex flex-row gap-x-4 justify-center items-center ">
                        <Newbie/>
                        <Master/>
                        <Ultimate/>
                    </div>
                </div>
            </div>
            <div className="relative flex w-[85vw] justify-center h-auto">
                <History props={params.id}/>
            </div>
        </div>
    </Layout>
    )
}