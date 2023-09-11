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
import { FC,PropsWithChildren } from 'react'
import { Outlet ,} from 'react-router'
import { matchRoutes, useLocation } from "react-router-dom"
import { userContext , UserType } from '../../Context'
import { useContext , useEffect } from 'react'

const routes = [{ path: "Profile/:id" } , {path : "Settings"} , {path : "Home"}, {path:"Chat"} , {path:"Play"}]

const useCurrentPath = () => {
    const location = useLocation()
    const  [{route}] :any = matchRoutes(routes, location)
    return route.path
}

export const Layout : FC<PropsWithChildren> =  () : JSX.Element =>
{
    const {user , login} :any  = useContext(userContext)
    useEffect(() => {
    if (user.isLogged === false){
            const fetchUser = async() => {
                const res = await fetch("https://randomuser.me/api");
                const data = await res.json();
                const user_data = data.results[0];
                console.log(user_data)
           
                const userInitialValue : UserType= {
                    isLogged:true,
                    id:user_data.id.value,
                    name:{
                        first:user_data.name.first,
                        last:user_data.name.last
                    },
                    picture:{
                        thumbnail:user_data.picture.thumbnail,
                        medium:user_data.picture.medium,
                        large:user_data.picture.large
                    },
                    
                    email:user_data.email,
                    token:'',
                    tfa:false,
                    friendListIds:[],
                    banListIds:[],
                    achivments:[],
                    dmsIds:[],
                    history:[],
                    chatRoomsJoinedIds:[]
                    
                }
                console.log(userInitialValue)
                login(userInitialValue)
            }
            fetchUser()
        }
    })
    const path : string  = useCurrentPath()
    const obj = {x:"30",y:"20"}
    return (
    <>
        <div data-theme="mytheme" className=' h-screen bg-slate-50 '> 
           
            <div className=' flex flex-row  w-screen h-[8vh]  bg-base-200'> 
                <div className='flex justify-start items-center z-50 pl-1  sm:pl-2  h-full w-full'>
                    <Logo {...obj}/>
                </div>
                <div className='flex items-center  justify-end pr-6 gap-6 h-full w-full'>
                    <Search/>
                    <Alert /> 
                    <Avatar picture={`${user.picture.medium}`} />
                </div>
            </div>
            <div className='flex'>
           
            <div className='sm:flex flex-col hidden justify-around items-stretch h-[92vh] bg-base-200 overflow-auto md:pt-10  sm:w-[11vw]  md:w-[9vw] lg:w-[8vw] xl:w-[7vw] 2xl:w-[6vw] 3xl:w-[5vw]'>
                <div className="flex flex-col pl-[1.4vw] justify-evenly content-start gap-y-10 pb-44 ">
                    <Dash selected={path === "Home" ? true : false}/>
                    <Game selected={path === "Play" ? true : false}/>
                    <Message selected={path === "Chat" ? true : false}/>
                    <Profile selected={path === "Profile/:id" ? true : false}/>
                    <Settings selected={path === "Settings" ? true : false}/>
                </div>
                <div className="flex flex-col pl-[1vw] justify-start">
                    <Out/>
                </div>
            </div>
                <div className=" h-[8vh] fixed bottom-0 sm:hidden btm-nav bg-base-200 flex justify-end z-50">
                    <button className="">
                        <Dash selected={path === "Home" ? true : false} />                    
                    </button>
                    <button className="">
                        <Game selected={path === "Play" ? true : false}/>
                    </button>
                    <button className="">
                        <Message selected={path === "Chat" ? true : false}/>                   
                    </button>
                    <button className="">
                        <Profile selected={path === "Profile/:id" ? true : false}/>                    
                    </button>
                    <button className="">
                        <Settings selected={path === "Settings" ? true : false}/>                    
                    </button>
                </div>
                <div className='sm:-ml-4 sm:w-[92vw] xl:w-[96vw] md:w-[93.5vw] w-screen right-0 z-10 h-[84vh] sm:h-[92vh]  bg-base-100 sm:rounded-tl-2xl  overflow-auto no-scrollbar'>
                    <Outlet/>
                </div>
            </div>
        </div>
    </>
    )
}