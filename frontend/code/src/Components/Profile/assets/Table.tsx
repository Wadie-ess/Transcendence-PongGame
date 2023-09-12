import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Load , Loading} from '../../Loading/';
import { useParams } from 'react-router-dom';

export const Table = (props:any) =>
{
    const param = useParams();
    const [users, setUsers] = useState<any | undefined>([]);
    const [enemys , setEnemys] = useState<any | undefined>([]);
    const [loading , setLoading] = useState<boolean>(true);
    useEffect( ()  => {
      setLoading(true)
      setUsers([])
      setEnemys([])
      const fetchdata = async() =>{
        for (let i = 0 ; i < 5 ; ++i){
          let response = await fetch(`https://randomuser.me/api/`)
          let data  = await response.json()
          if (data.results && data.results.length > 0) {
              const newUser = data.results[0];
              newUser.seed = data.info.seed;
              setEnemys((oldUsers : any) => [...oldUsers, newUser]);
          }
        }
        for (let i = 0 ; i < 5 ; ++i){
            let response = await fetch(`https://randomuser.me/api/`)
            let data  = await response.json()
            if (data.results && data.results.length > 0) {
                const newUser = data.results[0];
                newUser.seed = data.info.seed;
                setUsers((oldUsers : any) => [...oldUsers, newUser]);
            }
        }
        setLoading(false)
      }
      fetchdata().catch(console.error)  
    },[param])
    return (
          <div className=" no-scrollbar w-full ">
            <table className="table w-full ">
            
              <tbody className='flex flex-col justify-start items-center gap-y-2 md:gap-y-4'>
                {!loading && users.map((x: any ,index:number) => (
                  <tr
                    key={index}
                    className='bg-secondary-content border-base-200 grow-0 rounded-xl w-11/12  flex justify-center md:justify-evenly px-1  items-center h-16 md:h-24'
                  >
                    <td className='hidden md:w-3/12 md:flex md:justify-start  md:px-1'>
                      
                        <div className='flex justify-start items-center font-poppins font-medium'>
                          today 17:45
                    
                      </div>
                    </td>
                    <td className='px-1 flex justify-center items-center md:gap-x-2 grow gap-y-1 w-auto'>
                      <div className=" flex justify-start items-center gap-x-2 md:gap-x-10 w-full">
                        {x?.name?.first ?  <div className="flex justify-center items-center text-xs font-poppins font-medium w-20 md:w-28 text-neutral">{x.name.first}</div> : <Load/>}
                        {x?.seed ?  <Link to={`/Profile/${x.seed}`}><img className='md:rounded-2xl rounded-xl h-8 md:h-12' src={x.picture.thumbnail} alt="Avatar Tailwind CSS Component" /> </Link> : <Load/>}                
                        <div className='flex flex-row items-center  gap-x-1 justify-center w-16  md:w-20 h-6 rounded-r-3xl rounded-l-3xl bg-neutral text-accent font-poppins'> 
                          <span className='font-poppins font-medium'>1</span><span className='font-poppins font-medium'> : </span><span className='font-poppins font-medium'>1</span>
                        </div>
                        
                        {enemys[index]?.seed ? <Link to={`/Profile/${x.seed}`}><img className='md:rounded-2xl rounded-xl h-8 md:h-12' src={enemys[index].picture.thumbnail } alt="Avatar Tailwind CSS Component" />  </Link> : <Loading props={"lg"}/>}
                        <div className="flex justify-center items-center text-xs font-poppins font-medium  w-20 md:w-28 text-neutral">{enemys[index]?.name?.first  ? enemys[index].name.first : <Loading props={"sm"}/>}  </div> 
                      </div>
                    </td>
                    <td className='flex px-1 grow-0 justify-end items-center gap-x-1  w-auto'><div className='w-18 text-lime-400'> + 1</div></td>
                  </tr>
                ))}
                { loading && (
                    <Loading size={"lg"}/>
                  )

                }
              </tbody>
            </table>
          </div>
        )
      

     
}