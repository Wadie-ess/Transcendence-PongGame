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
import { FC,PropsWithChildren, useLayoutEffect } from 'react'
import { Outlet ,} from 'react-router'
import { matchRoutes, useLocation } from "react-router-dom"
import { useUserStore } from '../../Stores/stores'
import { useNavigate } from 'react-router-dom'
import api from '../../Api/base'
// import { FirstLogin } from '../FirstLogin'

const routes = [{ path: "Profile/:id" } , {path : "Settings"} , {path : "Home"}, {path:"Chat"} , {path:"Play"}, {path:"Pure"}, {path:"Game"}]
const HideBg = () => {
    return (
        <div className='absolute h-screen bg-black opacity-20 blur-xl z-[1999]'>
        </div>
    )
}
const useCurrentPath = () => {
    const location = useLocation()
    const  [{route}] :any = matchRoutes(routes, location)
    return route.path
}

export const Layout : FC<PropsWithChildren> =  () : JSX.Element =>
{
    const user = useUserStore();
    const navigate = useNavigate();
    
    useLayoutEffect(() => {
        const log = async() => {
            try{
                await user.login()
            }
            catch(e)
            {
                try
                {
                    await api.get("/auth/refresh")
                    await user.login()
                }catch(e)
                {
                    navigate("/")
                    user.logout()
                }
                
            }
            
        }
        log()
        //eslint-disable-next-line
    },[])
    const path : string  = useCurrentPath()
    const obj = {x:"30",y:"20"}
    return (
    <>
        {/* {
            !user.profileComplet && <FirstLogin/>
        }  */}
        {user.isLogged && !user.profileComplet && <HideBg/>}
        {user.isLogged   && 
        <div data-theme="mytheme" className={`h-screen ${!user.profileComplet ? "":""}`}> 
           
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
                <div className='sm:-ml-4 sm:w-[92vw] xl:w-[96vw] md:w-[93.5vw] w-screen right-0 z-10 h-[84vh] sm:h-[92vh]  bg-accent sm:rounded-tl-2xl'>
                    <Outlet/>
                </div>
            </div>
        </div>
    }
    </>
    )
}