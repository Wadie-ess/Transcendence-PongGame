import { Pong } from './assets/Pong'
import { File } from './assets/File'
import { Share } from './assets/ShareB'
import { Message } from './assets/MessageB'
import { History } from './History'
import Hero from './assets/Hero.gif'
import { useState , useEffect , useContext} from 'react'
import {  Link, useParams } from 'react-router-dom'
import { Load } from '../Loading/'
import  Newbie  from '../Badges/Newbie.svg'
import  Master  from '../Badges/Master.svg'
import  Ultimate  from '../Badges/Ultimate.svg'
import { userContext } from '../../Context'
import { Edit } from './assets/Edit'
export const Profile = () =>{
    const {user} :any = useContext(userContext);
    const params = useParams()
    console.log(`params : ${params.id} type ${typeof(params.id)}`)
    const [users, setUsers] = useState<null | any>(undefined);
 
        useEffect(() => {
            const fetchUser = async() => {
                const response = await fetch(`https://randomuser.me/api?seed=${params.id}`)
                const data = await response.json();
                const collecteduser = data.results[0]
                setUsers(collecteduser)
            }
            if (params.id !== "me")
                fetchUser();
            else
                setUsers(user)
        },[params, user])
        console.log(users)
    

    return (
        <>
        <div className=" flex flex-col items-center h-full min-h-screen bg-accent">
            <div className='relative pt-12 h-auto max-h-[30vh] min-h-[16vh] md:min-h-[28vh] xl:min-h-[33vh] w-[85vw]'>
               
                <div className='relative h-full w-full md:px-32 bg-[#2b3bfb] rounded-t-3xl'><img className='flex-1  w-full h-auto object-scale-down md:object-top object-bottom rounded-t-3xl' src={Hero} alt="bg hero"></img>
                    <div className=' absolute  bg-black top-0 left-0  object-scale-down object-top  opacity-40 h-full w-full rounded-t-3xl  z-10'></div>
                    <Pong/>
                </div>
                     
                <div className="avatar w-[10vw] absolute z-40 -bottom-4 sm:-bottom-6 md:-bottom-11 left-6 sm:left-12 ">
                    <div className="w-[13vw] xl:w-[8vw] rounded-full ring ring-neutral flex justify-center items-center ring-offset-base-100 ring-offset-1">
                        {
                            users?.picture?.large ? <img src={users?.picture?.large} alt="profile avatar" />: <Load/>
                        }
                        
                    </div>
                </div>         
            </div>
            <div className='relative flex flex-col gap-y-2 sm:gap-y-0 pl-4 sm:pt-12 pt-6 text-neutral font-montserrat bg-base-200  justify-start  items-start h-[15%] xl:h-[25%] xl:min-h-[25%] min-h-[20%] rounded-b-3xl w-[85vw] overflow-scroll no-scrollbar'>
                    {
                            users?.name?.first ? <h6>{users?.name?.first} </h6>: <Load/>
                    }                <div className="flex justify-center items-center gap-x-2">
                    <File/>
                    <span className='text-xs font-mono '>bio bla bla bla</span>
                </div>
                <div className="  w-full flex flex-col  sm:flex-row sm:flex-wrap  sm:justify-between items-center gap-x-4  h-2/6">
                    <div className="flex flex-col gap-y-2 flex-0 sm:flex-row sm:gap-x-4 justify-center items-center sm:justify-start sm:items-start  sm:w-[25vw]">
                        {params.id !== "me" ?
                            (<><Message/>
                            <Share/></>)
                            :
                            (
                                <Link to={"/Settings"}><Edit/></Link>   
                            )
                         
                        }
                    </div>
                    <div className="flex flex-row gap-x-4 justify-center items-center  w-72 sm:w-auto sm:pr-4 sm:pt-0 pt-4">
                        <img className={`h-[10vh] sm:h-[16vh] `} src={Newbie} alt="newbie badge" />
                        <img className={`h-[10vh] sm:h-[16vh] opacity-30`} src={Master} alt="Master badge" />
                        <img className={`h-[10vh] sm:h-[16vh] `} src={Ultimate} alt="Ultimate badge" />
                    </div>
                </div>
            </div>
            <div className="relative flex w-[85vw] justify-center h-auto">
                <History props={params.id}/>
            </div>
        </div>
    </>
    )
}