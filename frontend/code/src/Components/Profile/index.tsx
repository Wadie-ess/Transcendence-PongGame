import { Pong } from './assets/Pong'
import { File } from './assets/File'
import { Share } from './assets/ShareB'
import { Message } from './assets/MessageB'
import { History } from './History'
import Hero from './assets/Hero.gif'
import { useState , useEffect } from 'react'
import {  Link, useParams } from 'react-router-dom'
import { Load } from '../Loading/'
import  Newbie  from '../Badges/Newbie.svg'
import  Master  from '../Badges/Master.svg'
import  Ultimate  from '../Badges/Ultimate.svg'
import { Edit } from './assets/Edit'
import { useUserStore } from '../../Stores/stores'
import dots from './assets/svg/threedots.svg'
export const Profile = () =>{
    const user = useUserStore();
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
            <div className='relative flex flex-col gap-y-4 sm:gap-y-0 pl-4  text-neutral font-montserrat bg-base-200  justify-start  items-start h-[15%] xl:h-[30%] xl:min-h-[27%] min-h-[25%] rounded-b-3xl w-[85vw] overflow-scroll no-scrollbar'>
                    {
                            users?.name?.first ? <h6 className='sm:pt-12 pt-6 font-poppins font-bold text-xl'>{users?.name?.first} {users.name.last} </h6>: <Load/>
                    }                <div className="flex justify-center items-center gap-x-2">
                    <File/>
                    <span className='text-sm pt-4 font-mono '>{user.bio}</span>
                </div>
                <div className="  w-full h-full flex flex-col  sm:flex-row sm:flex-wrap  sm:justify-between  gap-x-4">
                    <div className="flex flex-col gap-y-0 items-center h-full sm:flex-row sm:gap-x-4 justify-center sm:justify-start sm:items-end pb-4 sm:w-[25vw]">
                        {
                            params.id !== "me" ?
                            (<><Message/>
                            <Share/></>)
                            :
                            (
                                <Link to={"/Settings"}><Edit/></Link>   
                            )
                        }
                    </div>
                    <div className="flex h-full w-full flex-row gap-x-4 justify-center sm:justify-start items-center  sm:w-auto sm:pr-4 sm:pt-0 pt-4 ">
                        <img className={`h-[9vh] sm:h-[11vh] md:h-[12vh] lg:h-[13vh] xl:h-[15vh] 2xl:h-[16vh] `} src={Newbie} alt="newbie badge" />
                        <img className={`h-[9vh] sm:h-[11vh] md:h-[12vh] lg:h-[13vh] xl:h-[15vh] 2xl:h-[16vh] opacity-30`} src={Master} alt="Master badge" />
                        <img className={`h-[9vh] sm:h-[11vh] md:h-[12vh] lg:h-[13vh] xl:h-[15vh] 2xl:h-[16vh] `} src={Ultimate} alt="Ultimate badge" />
                        <div className="flex h-full items-start cursor-pointer dropdown dropdown-end">
                            <label tabIndex={0} className="btn m-1">
                                <img src={dots} alt="three dots" />
                            </label>
                            <ul tabIndex={0} className="relative top-14 dropdown-content z-[1] menu p-2 shadow bg-base-200  rounded-box w-52">
                                <li className='hover:bg-primary  hover:rounded-xl transform duration-500'><div>Block</div></li>
                                <li className='hover:bg-primary  hover:rounded-xl transform duration-500'><div>Send friend request</div></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative flex w-[85vw] justify-center h-auto  overflow-scroll no-scrollbar">
                <History props={params.id}/>
            </div>
        </div>
    </>
    )
}