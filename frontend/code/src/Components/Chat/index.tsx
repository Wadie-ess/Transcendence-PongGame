import {
  Close,
  Bio,
  groupIcon,
  chatRooms,
  RoomsIcon,
  RoomMember,
} from "./Components/tools/Assets";
import { useEffect, useState } from "react";
import { Conversation } from "./Components/Conversation";
import { ChatPaceHolderProps } from "./Components/Conversation";
import users from "./Components/tools/Assets";
import React from "react";
import { ChatType, useChatStore } from "./Controllers/ChatControllers";

import { RecentConversations } from "./Components/RecentChat";
import { NullPlaceHolder } from "./Components/RoomChatHelpers";
import { getRoomMembersCall } from "./Services/ChatServices";

import toast from "react-hot-toast";

export interface ConversationProps {
  onRemoveUserPreview: () => void;
}

export const Chat = () => {
  const [showUserPreview, setShowUserPreview] = useState(false);
  const selectedChatType = useChatStore((state) => state.selectedChatType);

  const chatRooms = useChatStore((state) => state.recentRooms);
  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };
  return (
    <>
      <div className="flex h-full divide-black divide-x-4 bg-[#1A1C26]">
        <div
          className={` ${
            showUserPreview === true ? "w-5/12 " : "w-5/12 md:w-4/12"
          }`}
        >
          {<RecentConversations />}
        </div>
        <div
          className={` ${
            showUserPreview ? "w-6/12" : "w-8/12"
          } overflow-hidden bg-gray-900`}
        >
          {chatRooms.length < 1 && selectedChatType === ChatType.Room ? (
            <NullPlaceHolder message="" />
          ) : (
            <Conversation onRemoveUserPreview={handleRemoveUserPreview} />
          )}
        </div>
        <div className={` ${showUserPreview ? "w-3/12" : ""}  bg-[#1A1C26]`}>
          {showUserPreview && (
            <UserPreviewCard onRemoveUserPreview={handleRemoveUserPreview} />
          )}
        </div>
      </div>
    </>
  );
};

export const UserPreviewCard: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const [currentUsers, setUsers] = useState<RoomMember[]>([]);
  const [MyUsers] = useState(users);

  const SelectedChat = useChatStore((state) => state.selectedChatID);

  const currentUser = MyUsers.find((user) => user.id === SelectedChat);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const currentRoom = chatRooms.find((room) => room.id === SelectedChat);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getRoomMembersCall(currentRoom?.id as string, 0, 100).then(
          (res) => {
            if (res?.status === 200 || res?.status === 201) {
              const extractedData = res.data.map(
                (item: { user: RoomMember }) => item.user
              );
              setUsers(extractedData);
            } else {
              toast.error("Error getting room members");
            }
          }
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
      // eslint-disable-next-line
  }, [selectedChatType]);
  return (
    <div className="flex flex-col p-4   ">
      <div className="flex flex-row justify-between ">
        {selectedChatType === ChatType.Chat ? (
          <p className="text-white font-poppins font-light text-base">
            {currentUser?.name}'s Info
          </p>
        ) : (
          <p className="text-white font-poppins font-light text-base">
            {currentRoom?.name}'s Info
          </p>
        )}

        <button onClick={onRemoveUserPreview}>
          <img alt="" src={Close} />
        </button>
      </div>
      <div className="flex flex-row justify-center p-4">
        <img
          className="w-36 rounded-full "
          alt=""
          src={
            selectedChatType === ChatType.Chat ? currentUser?.image : groupIcon
          }
        />
      </div>
      <div className="flex flex-row justify-center p-1 text-white font-poppins text-26 font-medium">
        <p>
          {selectedChatType === ChatType.Chat
            ? currentUser?.name
            : currentRoom?.name}
        </p>
      </div>
      <div className="flex flex-row justify-center p-1 text-gray-400 font-poppins font-medium text-base">
        <p> {selectedChatType === ChatType.Chat ? "Friend" : "Chat Room"}</p>
      </div>
      {selectedChatType === ChatType.Chat ? (
        <div>
          <div className="flex flex-row  text-gray-400 font-poppins font-medium text-base ">
            <img alt="" src={Bio} />
            {}
            <p className="pl-2">{currentUser?.name}'s Bio</p>
          </div>
          <div className=" bg-[#1A1C26]">
            <p className="text-white  p-1 pt-2 font-poppins font-normal whitespace-normal overflow-auto break-words">
              hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <div className="flex flex-row  text-gray-400 font-poppins font-medium text-base ">
            <img alt="" src={RoomsIcon} />
            {}
            <p className="pl-2 ">{currentRoom?.name}'s Members</p>
          </div>
          <div className="max-h-[280px] overflow-y-auto no-scrollbar">
            {currentUsers.map((user) => (
              <div key={user.userId} className="overflow-x-auto">
                <table className="table">
                  <tbody>
                    <tr>
                      <th></th>
                      <td>
                        <div className="flex items-center space-x-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-11 h-11">
                              <img
                                // src={user.image}
                                alt="Avatar Tailwind CSS Component"
                              />
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 font-poppins font-medium text-base">
                              {user.firstName}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SelectedUserTile = ({
  username,
  userImage,
}: ChatPaceHolderProps) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <tbody>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={userImage}
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{username}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
