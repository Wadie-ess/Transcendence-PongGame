import { useState,useEffect } from 'react'




export const Table = () =>
{
    const [users, setUsers] = useState<any | undefined>([])
    useEffect( ()  => {
      const fetchdata = async() =>{
          for (let i = 0 ; i < 5 ; ++i)
          {
            let response = await fetch(`https://randomuser.me/api/`)
            let data  = await response.json()
            if (data.results && data.results.length > 0) {
                const newUser = data.results[0];
                setUsers((oldUsers : any) => [...oldUsers, newUser]);
            }
          }
      }
      fetchdata().catch(console.error)  
    },[])
    return (
        <div className=" no-scrollbar sm:w-full ">
          <table className="table w-full ">
           
            <tbody className='flex flex-col justify-start items-center gap-y-2 sm:gap-y-4'>
              {users.map((x: any,index:number, elemetns: any) => (
                <tr
                  key={index}
                  className='bg-primary border-base-200  rounded-xl w-11/12  flex justify-center sm:justify-center px-2 sm:h-20 h-14 xl:h-24 sm:px-2 items-center'
                >
                  <td className='w-3/12 flex justify-start  px-1'>
                    
                      <div className='flex justify-start items-center font-poppins'>
                        today 17:45
                   
                    </div>
                  </td>
                  <td className='px-1 flex justify-center items-center gap-x-2 gap-y-1 w-auto'>
                    <div className=" flex justify-start items-center gap-x-1 sm:gap-x-10 w-full">
                      <div className="flex justify-center items-center text-xs font-poppins sm:font-poppins-[1rem]  w-16 sm:w-28 break-normal	">{x.name.first}</div>
                      <img className='sm:rounded-2xl rounded-xl h-8 sm:h-12' src={x.picture.thumbnail} alt="Avatar Tailwind CSS Component" />                    
                      <div className='flex flex-row items-center  gap-x-1 justify-center w-16  sm:w-20 h-8 rounded-r-3xl rounded-l-3xl bg-neutral text-accent font-poppins'> 
                        <span>1</span><span>-</span><span>1</span>
                      </div>
                      <img className='sm:rounded-2xl rounded-xl h-8 sm:h-12' src={ users[Math.floor(users.length % (Math.random()*  users.length - 1))].picture.thumbnail} alt="Avatar Tailwind CSS Component" />  
                      <div className="flex justify-center items-center text-xs font-poppins sm:font-poppins-[1rem] w-20 sm:w-28 text-neutral">{ elemetns[Math.floor(elemetns.length % (Math.random()*  elemetns.length - 1))].name.first}</div>

                    </div>
                  </td>
                  <td className='flex px-1 justify-end items-center gap-x-1  w-auto'><div className='w-18 text-lime-400'> + 1</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}