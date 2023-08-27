import { useState,useEffect } from 'react'




export const Table = () =>
{
    const [users, setUsers] = useState<any | undefined>([])
    var nextusers : any;
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
    nextusers = [...users]
    return (
        <div className="overflow-auto no-scrollbar w-full">
          <table className="table w-full">
           
            <tbody className='flex flex-col justify-between items-center gap-2 sm:gap-4'>
              {users.map((x: any,index:number, elemetns: any) => (
                <tr
                  key={index}
                  className='bg-primary border-base-200 rounded-xl w-11/12 flex justify-center sm:justify-center px-2 h-20 xl:h-24 sm:px-10 items-center'
                >
                  <td className='w-2/12 flex justify-center '>
                    <div className="flex items-center ">
                      <div className='flex justify-center items-center gap-x-3'>
                        today , 17:45
                      </div>
                    </div>
                  </td>
                  <td className='flex justify-center items-center gap-x-2 gap-y-1 w-8/12'>
                    <div className=" flex justify-start items-center gap-x-4">
                      <div className="flex font-montserrat w-[5vw] text-neutral font-semibold">{x.name.first}</div>
                      <img className='rounded-xl' src={x.picture.thumbnail} alt="Avatar Tailwind CSS Component" />                    
                      <div className='flex flex-row items-center gap-x-2 justify-center w-16 h-6 rounded-full bg-neutral text-accent font-poppins'> 
                        <span>1</span><span>-</span><span>1</span>
                      </div>
                      <img className='rounded-xl' src={ nextusers[Math.floor(nextusers.length % (Math.random()*  nextusers.length - 1))].picture.thumbnail} alt="Avatar Tailwind CSS Component" />  
                      <div className="flex font-montserrat w-[5vw] text-neutral font-semibold">{ nextusers[Math.floor(nextusers.length % (Math.random()*  nextusers.length - 1))].name.first}</div>

                    </div>
                  </td>
                  <td className='flex justify-start items-center gap-x-1 w-18 w-2/12'><div className='text-lime-400'> + 1</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}