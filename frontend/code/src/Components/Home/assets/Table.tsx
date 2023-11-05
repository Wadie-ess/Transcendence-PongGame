import { Trophy } from './Trophy' 
import { useState,useEffect, useCallback, useRef, FC } from 'react'
import { Daimond } from './Daimond'
import { Loading } from '../../Loading'
import { Link } from 'react-router-dom'
import { NullPlaceHolder } from '../../Chat/Components/RoomChatHelpers'
import { Logo } from '../../Layout/Assets/Logo'
import InfiniteScroll from 'react-infinite-scroll-component';
import api from '../../../Api/base'
import toast from 'react-hot-toast'

export const Table: FC = () =>
{
  const [users, setUsers] = useState<any>([])
  const [loading , setLoading] = useState<boolean>(true)
  const page  = useRef(0);
  const hasMoreItems = useRef(true)
  const [nextPageUrl, setNextPageUrl] : any = useState(
    "/leaderboard?offset=0&limit=20"

  );
  
  const [fetching, setFetching] = useState(false);

  const fetchItems = useCallback(
    async () => {
      if (fetching) {
        return;
      }

      setFetching(true);

      try {
        const newdata : any = await api.get(nextPageUrl);
        if (newdata.data.length < 20) {
          setUsers([...users, ...newdata.data]);
          setNextPageUrl(null); 
          return;
        }
        console.log(newdata.data.length)
        if (!newdata.data || newdata.data.length === 0)
        {
          setNextPageUrl(null)
          return ;
        }
        else
        {
          console.log(newdata.data)
          console.log("here")
          setUsers([...users, ...newdata.data]);
          setNextPageUrl(`/leaderboard?offset=${page.current}&limit=20`);
          page.current += 20;
        }

        
      }
      catch(e)
      {
        toast.error("Can't get leadeboard");
      }
       finally {
        setLoading(false)

        setFetching(false);
      }
    },
    [users, fetching, nextPageUrl]
  );

  useEffect(() => {
    fetchItems()
    page.current += 20;
    //eslint-disable-next-line
  },[])
  hasMoreItems.current = !!nextPageUrl;
  
    return (
      users?.length > 0 || loading ? (
        <div className='w-full h-full'  >
        <InfiniteScroll
                    dataLength={users.length}
                    next={fetchItems}
                    loader={<div className='flex items-center justify-center w-full '><Logo x={"12"} y={"12"}/></div>}
                    endMessage={<div className='p-4 flex justify-center items-center font-montserrat text-neutral'>No more results!</div>}
                    hasMore={hasMoreItems.current} 
                    scrollableTarget="scrollTarget"
                    style={{overflow:"auto", height:"100%"}}
                    >
          <table className="table w-full">
            <thead>
              <tr className='w-[80vw] flex justify-between px-10 items-center'>
                <th>Place</th>
                <th>User</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody className='flex flex-col justify-between  no-scrollbar items-center gap-2 sm:gap-4'>


              {!loading && users.map((x: any, index: number) => (
                <tr
                  key={index}
                  className='bg-accent border-base-200 rounded-xl w-11/12 flex justify-between sm:justify-between px-4 h-16 xl:h-28 sm:px-10 items-center'
                >
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className='flex justify-center items-center gap-x-3'>
                        <Trophy /> {index + 1}
                      </div>
                    </div>
                  </td>
                    <td className='flex justify-start items-center gap-x-2 hover:cursor-pointer'>
                    <Link to={`/Profile/${x.userId}`}>
                      <div className="flex justify-start items-center gap-x-2 hover:cursor-pointer"><div className="avatar">
                      <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={`https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${x?.avatar}`} alt="Avatar Tailwind CSS Component" />                      </div>
                    </div>
                    <div className="flex font-montserrat w-20 text-neutral font-semibold ">{x?.Username}</div>
                    </div>
                    </Link>
                    </td>
                  <td className='flex justify-start items-center gap-x-1 w-18'><Daimond/> <div>{x?.wins}</div></td>
                </tr>
               
               
               ))}
              {loading && (<Loading size={"lg"}/>)}
            </tbody>
          </table>
          </InfiniteScroll>
          </div>
      ):(
        <div className='h-full w-full flex items-center justify-center'>
          <NullPlaceHolder message='No leaderboard available'/>
        </div>
      )
    
      );
}