import { Trophy } from './Trophy' 
import { useState,useEffect } from 'react'





export const Table = () =>
{
    const [users, setUsers] = useState<any | undefined>([])
    useEffect( ()  => {
        
            const fetchdata = async() =>{
                for (let i = 0 ; i < 10 ; i++)
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
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr className='w-[80vw] flex justify-between px-10 items-center'>
                <th>Place</th>
                <th>User</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody className='flex flex-col justify-center items-center content-center gap-4'>
              {users.map((x: any, index: number) => (
                <tr
                  key={index}
                  className='bg-base-100 border-base-200 rounded-3xl w-[80vw] flex justify-between px-10 items-center'
                >
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className='flex justify-center items-center gap-x-3'>
                        <Trophy />
                      </div>
                    </div>
                  </td>
                  <td className='flex justify-start items-center gap-x-2'>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={x.picture.thumbnail} alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div className="flex font-montserrat ">{x.name.first}</div>
                  </td>
                  <td>24</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}