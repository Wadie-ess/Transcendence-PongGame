import { Trophy } from './Trophy' 
import { useState,useEffect } from 'react'

const [users, setUsers] = useState<any | undefined>([])

useEffect( ()  => {
    const fetchdata = async() =>{
        let response = await fetch(`https://randomuser.me/api/`)
        let data  = await response.json()
        console.log(data)
        if (data)
            setUsers((users) => ...users , data)
    }
    fetchdata().catch(console.error)
},[])

export const Table = () =>
{
    return (
    <div className="overflow-x-auto w-full">
  <table className=" table w-full">
    <thead>
      <tr className=' w-[80vw] flex justify-between px-10  items-center '>
        <th>Place</th>
        <th>User</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody className='flex flex-col justify-center items-center content-center gap-4'>
      <tr className='bg-base-100 border-base-200 rounded-3xl w-[80vw] flex justify-between px-10  items-center '>
        <td>
          <div className="flex items-center space-x-3 ">
            <div className='flex justify-center items-center gap-x-3'>
               <Trophy/>
             
              
            </div>
          </div>
        </td>
        <td className='flex justify-start items-center gap-x-2'>
            <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                    <img src="https://daisyui.com//tailwind-css-component-profile-2@56w.png" alt="Avatar Tailwind CSS Component" />
                </div>
            </div>
            <div className="flex font-montserrat ">wadie </div>
        </td>
        <td>
          24
        </td>
      </tr>
     
    </tbody>
    
  </table>
</div>
    )
}