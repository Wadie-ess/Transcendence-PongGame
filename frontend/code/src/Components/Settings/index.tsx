import { Avatar } from './assets/Avatar'
import { Edit } from './assets/Edit'
import  Newbie  from '../Badges/Newbie.svg'
import  Master  from '../Badges/Master.svg'
import  Ultimate  from '../Badges/Ultimate.svg'
import { api }from '../../Api/base'
import toast from 'react-hot-toast'
import { useContext ,  useState , useEffect} from 'react'
import { userContext } from '../../Context'

export const Setting = () => { 
    const getdata :any = async() => {
            const data:any = await api.get("/test")
          return data
    }
    const {user} :any = useContext(userContext);
    const [myuser, setMyuser] = useState(user);
    useEffect(()=>{
        setMyuser(user)
    },[myuser, user])
    return (
            
           <>
            
           <div className="flex h-[90vh] w-full  ">
                <h1 className='pt-6 pl-6 font-poppins font-medium text-xl text-neutral'>Profile Settings</h1>
                <div className=" h-[82%] w-[90%] flex flex-col absolute bottom-0 right-0 bg-base-200 rounded-tl-2xl">
                    <h2 className='pt-4 pl-4 text-neutral'>change preview</h2>
                    <div className="flex justify-center h-full w-full pt-8">
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4 justify-between overflow-auto  w-[90%]  max-h-[20vh]  bg-base-100 border-solid border-gray-400 border-2  rounded-3xl">
                            <div className='flex justify-between items-center gap-x-10 px-2 sm:px-0'>
                                <div className='relative sm:pl-10 pt-2 sm:pt-0'><Avatar picture={myuser.picture.medium}/>
                                    <div className="absolute bottom-0 right-0">
                                        <Edit/>
                                    </div>
                                </div>
                                <div className='flex flex-col items-stretch justify-evenly gap-y-4'>
                                    <div className='text-neutral break-words break-all font-poppins font-medium text-sm sm:text-xl'> {myuser.name.first} {myuser.name.last} </div>
                                    <div className='font-poppins font-medium text-sm sm:text-lg'> Flutter Devoloper</div>
                                </div>
                            </div>
                            <div className="flex pr-6 items-center justify-center gap-x-2">
                             
                                <div onClick={()=> {toast.promise(
                                    
                getdata(),
                 {
                   
                   loading: 'Saving...',
                   success: <b>fetched</b>,
                   error: <b>could not fetch</b>,
                 }
               );}}>
                        </div>
                                <img className={`h-[9vh] sm:h-[14vh] `} src={Newbie} alt="newbie badge" />
                                <img className={`h-[9vh] sm:h-[14vh] opacity-30`} src={Master} alt="Master badge" />
                                <img className={`h-[9vh] sm:h-[14vh] `} src={Ultimate} alt="Ultimate badge" />
                            </div>
                        </div>
                    </div>
                    
                <h2 className='pt-4 pl-4 text-neutral'>change preview</h2>
                    <div className="flex justify-center h-full w-full pt-8">
                        <div className="flex flex-col sm:flex-row justify-between w-[90%] h-[50vh] sm:max-h-[50vh] max-h-[40vh] bg-base-100 border-solid border-gray-400 border-2  rounded-3xl">
                            <div className="flex justify-start  items-start pt-4 pl-4">
                                <h6 className='text-sm'>name</h6>
                                
                            </div>
                        </div>
                    </div>
                            
                </div>
           </div>
           </>
    )
}