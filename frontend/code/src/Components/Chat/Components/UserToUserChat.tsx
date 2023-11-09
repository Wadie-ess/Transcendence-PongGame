import { useEffect, useState } from "react";
import { UserPreviewCard } from "..";
import { Conversation } from "./Conversation";
import { useParams } from "react-router-dom";

import { useChatStore } from "../Controllers/RoomChatControllers";

export const UserToUserChat = () => {
  const params = useParams();
  console.log(`params : ${params.id} type ${typeof params.id}`);

  const ChatState = useChatStore((state) => state);
  const [showUserPreview, setShowUserPreview] = useState(true);

  useEffect(() => {
    console.log("selected chat id ", ChatState.selectedChatID);
    const fetchUser = async () => {
      // try {
      //    await api.get(`profile/${params.id}`).then((res) => {
      //     console.log(res.data);
      //     ChatState.setCurrentDmUser({
      //       secondUserId: res.data.id,
      //       id: res.data.id,
      //       name: `${res.data.firstName} `,
      //       avatar: {
      //         thumbnail: res.data.image,
      //         medium: res.data.image,
      //         large: res.data.image,
      //       },
      //     });
      //   });
      // } catch (error) {}
    };
    fetchUser();
    // eslint-disable-next-line
  }, [params]);
  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };
  return (
    <>
      <div className="flex h-full divide-black divide-x-4">
        <div
          className={` ${
            showUserPreview ? "w-8/12" : "w-full"
          } overflow-hidden bg-gray-900`}
        >
          <Conversation onRemoveUserPreview={handleRemoveUserPreview} />
        </div>
        <div className={` ${showUserPreview ? "w-4/12" : ""}  bg-[#1A1C26]`}>
          {showUserPreview && (
            <UserPreviewCard onRemoveUserPreview={handleRemoveUserPreview} />
          )}
        </div>
      </div>
    </>
  );
};

<div className="overflow-x-auto relative">
  <table className="table ">
    <tbody>
      <tr>
        <td>
          <div className="flex flex-row justify-between ">
            <div className="flex flex-row items-center space-x-3">
              <div className="avatar">
                <div className="mask mask-squircle w-12 h-12">
                  <img
                    // src={user.image}
                    alt="Avatar Tailwind CSS Component"
                  />
                </div>
              </div>
              {/* <div className="font-bold">{user.name}</div> */}
            </div>
            <div className="dropdown ">
              <label tabIndex={0} className="">
                <summary className="list-none p-3 cursor-pointer ">
                  {/* <img src={More} alt="More" /> */}
                </summary>
              </label>
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content z-[0] bg-base-100 rounded-box w-52   right-full absolute  "
              >
                <li>
                  <span className="hover:bg-[#7940CF]">Block</span>
                </li>
                <li>
                  <span className="hover:bg-[#7940CF]">
                    invite for a Pong Game
                  </span>
                </li>
                <li>
                  <span
                    // onClick={onRemoveUserPreview}
                    className="hover:bg-[#7940CF]"
                  >
                    Show User Info
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>;
