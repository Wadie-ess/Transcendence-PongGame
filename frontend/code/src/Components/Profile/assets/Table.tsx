import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {  Loading } from "../../Loading/";
import { Logo } from "../../Layout/Assets/Logo";
import InfiniteScroll from "react-infinite-scroll-component";
import { NullPlaceHolder } from "../../Chat/Components/RoomChatHelpers";
import api from "../../../Api/base";
import toast from "react-hot-toast";
import { formatTime } from "../../Chat/Components/tools/utils";
const getColor = (v1: number, v2: number) => {
  if (v1 > v2) return "text-lime-400";
  if (v1 < v2) return "text-red-400";
  return "text-gray-400";
};

// const getTime = (value: string) => {
//   const date = new Date(value);
//   const today = new Date();
//   console.log(date);
//   if (
//     date.getDate() === today.getDate() &&
//     date.getFullYear() === today.getFullYear() &&
//     date.getMonth() === today.getMonth()
//   )
//     return `Today ${date.getHours()}:${date.getMinutes()}`;
//   else if (
//     date.getDate() === today.getDate() - 1 &&
//     date.getFullYear() === today.getFullYear() &&
//     date.getMonth() === today.getMonth()
//   )
//     return `Yestrday ${date.getHours()}:${date.getMinutes()}`;
//   return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
// };

export const Table = (props: any) => {
  const [history, setHistory] = useState<any | undefined>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState(true);
  // const [nextPage , setNextPage] = useState(`/game/history/${param.id}?offset=${0}&limit=20`)
  const offset = useRef(0);

  const fetchData = async () => {
    try {
      const history: any = await api.get(`/game/history/${props.props.props}`, {
        params: { offset: offset.current, limit: 20 },
      });
      offset.current += 20;
      setHistory((prev: any) => [...prev, ...history.data]);
      setLoading(false);
      if (history.data.length < 20) setHasMore(false);
    } catch {
      toast.error("Error on loading match history");
    }
  };
  // useEffect(() => {
  //   fetchData();
  //   offset.current += 20;
  // },[])
  useEffect(() => {
    offset.current = 0;
    setHistory([]);
    setLoading(true);
    setHasMore(true);
    fetchData();
    offset.current += 20;
    //eslint-disable-next-line
  }, [props.props.props]);
  console.log(props);
  return history.length > 0 || loading === true ? (
    <div className="w-full h-full overflow-auto">
      <InfiniteScroll
        hasMore={hasMore}
        loader={
          <div className="flex items-center w-full h-full justify-center">
            <Logo x={"16"} y={"16"} />
          </div>
        }
        dataLength={history.length}
        next={fetchData}
        className="overflow-auto"
        scrollableTarget="scrollTarget"
        endMessage={
          <span className="flex justify-center items-center p-8 text-neutral font-montserrat">
            No more history
          </span>
        }
      >
        <table className="table w-full ">
          <tbody className="flex flex-col justify-start items-center gap-y-2 md:gap-y-4">
            {!loading &&
              history.map((x: any, index: number) => (
                <tr
                  key={index}
                  className="bg-secondary-content  border-base-200 grow-0 rounded-xl w-11/12  flex justify-center md:justify-evenly px-1  items-center  h-16 md:h-24 "
                >
                  <td className="hidden md:w-3/12 md:flex md:justify-start  md:px-1 pl-1">
                    <div className="flex justify-start items-center font-poppins font-xs">
                      {formatTime(x.match.createdAt)}
                    </div>
                  </td>
                  <td className="px-1 flex justify-center items-center md:gap-x-2 grow gap-y-1 w-auto">
                    <div className=" flex justify-start items-center gap-x-2 md:gap-x-10 w-full">
                      {x?.match?.Player1?.username ? (
                        <div className="flex justify-center items-center text-xs font-poppins font-medium w-20 md:w-28 text-neutral">
                          {x.match.Player1.username}
                        </div>
                      ) : (
                        <Loading props={"sm"} />
                      )}
                      {x?.match ? (
                        <Link to={`/Profile/${x.match.Player1.id}`}>
                          <img
                            className="md:rounded-2xl rounded-xl h-8 md:h-12"
                            src={x.match.Player1.avatar.medium}
                            alt="Avatar"
                          />{" "}
                        </Link>
                      ) : (
                        <Loading props={"sm"} />
                      )}
                      <div className="flex flex-row items-center  gap-x-1 justify-center w-16  md:w-20 h-6 rounded-r-3xl rounded-l-3xl bg-neutral text-accent font-poppins">
                        <span className="font-poppins font-medium">
                          {x.match.Player1.score}
                        </span>
                        <span className="font-poppins font-medium"> : </span>
                        <span className="font-poppins font-medium">
                          {x.match.Player2.score}
                        </span>
                      </div>

                      {x?.match?.Player2?.id ? (
                        <Link to={`/Profile/${x.match.Player2.id}`}>
                          <img
                            className="md:rounded-2xl rounded-xl h-8 md:h-12"
                            src={x.match.Player2.avatar.medium}
                            alt="Avatar Tailwind CSS Component"
                          />{" "}
                        </Link>
                      ) : (
                        
                        <Loading props={"lg"} />
                      )}
                      <div className="flex justify-center items-center text-xs font-poppins font-medium  w-20 md:w-28 text-neutral">
                        {x?.match?.Player2?.username ? (
                          x.match.Player2.username
                        ) : (
                          
                          <Loading props={"sm"} />
                        )}{" "}
                      </div>
                    </div>
                  </td>
                  <td className="flex px-1 grow-0 justify-end items-center gap-x-1  w-auto pr-1">
                    <div
                      className={`w-18 ${getColor(
                        x.match.Player1.score,
                        x.match.Player2.score
                      )}`}
                    >
                      {" "}
                      {x.match.Player1.score > x.match.Player2.score &&
                        "+ 1"}{" "}
                      {x.match.Player1.score < x.match.Player2.score && "- 1"}
                      {x.match.Player1.score === x.match.Player2.score && "0"}
                    </div>
                  </td>
                </tr>
              ))}
            {loading && <Loading size={"lg"} />}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  ) : (
    <div className="flex items-center justify-center w-full h-full font-montserrat text-neutral">
      <NullPlaceHolder message="No History Available" />
    </div>
  );
};
