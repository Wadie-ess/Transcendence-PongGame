import { Trophy } from './Trophy' 
import { useState,useEffect } from 'react'
import { Daimond } from './Daimond'




export const Table = () =>
{
    const [users, setUsers] = useState<any | undefined>([])
    useEffect( ()  => {
      const fetchdata = async() =>{
            for (let i = 0 ; i < 10 ; ++i)
            {
              let response = await fetch(`https://randomuser.me/api/`)
              let data  = await response.json()
              if (data.results && data.results.length > 0) {
                  const newUser = data.results[0];
                  setUsers((oldUsers : any) => [...oldUsers, newUser]);
                  console.log(newUser)
              }
            }
      }
      fetchdata().catch(console.error)  
    },[])
    return (
        <div className="overflow-x-auto no-scrollbar w-full">
          <table className="table w-full">
            <thead>
              <tr className='w-[80vw] flex justify-between px-10 items-center'>
                <th>Place</th>
                <th>User</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody className='flex flex-col justify-between items-center gap-2 sm:gap-4'>
              {users.map((x: any, index: number) => (
                <tr
                  key={index}
                  className='bg-accent border-base-200 rounded-xl w-11/12 flex justify-between sm:justify-between px-4 h-16 xl:h-20 sm:px-10 items-center'
                >
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className='flex justify-center items-center gap-x-3'>
                        <Trophy /> {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className='flex justify-start items-center gap-x-2'>
                      <div className="avatar">
                      <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={x.picture.thumbnail} alt="Avatar Tailwind CSS Component" />                      </div>
                    </div>

                    <div className="flex font-montserrat w-12 text-neutral font-semibold">{x.name.first}</div>
                  </td>
                  <td className='flex justify-start items-center gap-x-1 w-18'><Daimond/> <div>{index + 123}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}