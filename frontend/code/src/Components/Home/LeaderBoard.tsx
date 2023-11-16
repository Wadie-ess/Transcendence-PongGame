import { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { Chart } from "./assets/Chart";
import { Trophy } from "./assets/Trophy";
import { Daimond } from "./assets/Daimond";
import { Logo } from "../Layout/Assets/Logo";

import { NullPlaceHolder } from "../Chat/Components/RoomChatHelpers";

import api from "../../Api/base";

export const LeaderBoard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const page = useRef(0);
  const hasMoreItems = useRef(true);
  const [fetching, setFetching] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(
    "/leaderboard?offset=0&limit=20",
  );

  const fetchItems = useCallback(async () => {
    if (!nextPageUrl) return;
    if (fetching) return;

    setFetching(true);

    try {
      const newdata = await api.get(nextPageUrl);
      // End of pagination
      if (!newdata.data || newdata.data.length < 20) {
        newdata.data && setUsers([...users, ...newdata.data]);
        setNextPageUrl(null);
        // Update hasMoreItems state
        hasMoreItems.current = false;
        return;
      }
      // Prepare next page
      setUsers([...users, ...newdata.data]);
      setNextPageUrl(`/leaderboard?offset=${page.current}&limit=20`);
      page.current += 20;
      // Update hasMoreItems state
      hasMoreItems.current = true;
    } catch (e) {
      toast.error("Can't get leadeboard");
    } finally {
      setLoading(false);
      setFetching(false);
    }
  }, [users, fetching, nextPageUrl]);

  useEffect(() => {
    fetchItems();
    page.current += 20;
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col rounded-2xl justify-start items-start mt-6 sm:h-full h-full w-full bg-base-200">
      <div className="flex justify-start items-start gap-x-4 p-4 pb-0 md:p-8 md:pb-0">
        <Chart /> <span className="font-montserrat">Leader Board</span>
      </div>

      {users.length > 0 || loading ? (
        <div className="w-full h-full p-4 md:p-8">
          <InfiniteScroll
            dataLength={users.length}
            next={fetchItems}
            loader={
              <div className="flex items-center justify-center w-full ">
                <Logo className="sm:w-12 w-12" />
              </div>
            }
            endMessage={
              <div className="p-4 flex justify-center items-center font-montserrat text-neutral">
                No more results!
              </div>
            }
            hasMore={hasMoreItems.current}
            scrollableTarget="scrollTarget"
            style={{ overflow: "auto", height: "100%" }}
          >
            <table className="table w-full border-separate border-spacing-x-0 border-spacing-y-2">
              <thead>
                <tr className="w-full px-10">
                  <th>
                    <div className="flex justify-center items-center w-18">
                      Place
                    </div>
                  </th>
                  <th>
                    <div className="flex justify-center items-center w-full">
                      User
                    </div>
                  </th>
                  <th>
                    <div className="flex justify-center items-center w-18">
                      Score
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="no-scrollbar">
                {!loading &&
                  users.map((x: any, index: number) => (
                    <tr
                      key={index}
                      className="border-base-200 rounded-xl w-full px-4 h-16 sm:px-10 mb-2"
                    >
                      <td className="bg-accent rounded-l-xl">
                        <div className="flex justify-center items-center gap-x-2 w-18">
                          <Trophy className="w-5 h-5" /> {index + 1}
                        </div>
                      </td>
                      <td className="bg-accent">
                        <div className="flex justify-center items-center gap-x-2 hover:cursor-pointer">
                          <Link to={`/Profile/${x.userId}`}>
                            <div className="flex justify-start items-center gap-4 hover:cursor-pointer w-52">
                              <img
                                className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                                src={`https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${x?.avatar}`}
                                alt={x?.Username}
                              />
                              <div className="flex font-montserrat text-neutral font-semibold">
                                <span className="truncate w-40">
                                  {x?.Username}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </td>
                      <td className="bg-accent rounded-r-xl">
                        <div className="flex justify-center items-center gap-x-2 w-18">
                          <Daimond className="w-5 h-5" /> {x?.wins}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </InfiniteScroll>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <NullPlaceHolder message="No leaderboard available" />
        </div>
      )}
    </div>
  );
};
