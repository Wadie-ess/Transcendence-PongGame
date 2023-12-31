import {
  Close,
  Bio,
  groupIcon,
  chatRooms,
  RoomsIcon,
  RoomMember,
  NullUser,
} from "./Components/tools/Assets";
import { useEffect, useState } from "react";
import { Conversation } from "./Components/Conversation";
import { ChatPaceHolderProps } from "./Components/Conversation";

import React from "react";
import { ChatType, useChatStore } from "./Controllers/RoomChatControllers";

import { RecentConversations } from "./Components/RecentChat";
import {
  AddUsersModal,
  CreateNewRoomModal,
  ExploreRoomsModal,
  InitChatPlaceholder,
  RoomChatPlaceHolder,
  RoomSettingsModal,
} from "./Components/RoomChatHelpers";

import { getRoomMembersCall } from "./Services/ChatServices";

import { classNames } from "../../Utils/helpers";
import { useModalStore } from "./Controllers/LayoutControllers";

import { useNavigate } from "react-router-dom";

export interface ConversationProps {
  onRemoveUserPreview: () => void;
}

export const Chat = () => {
  const [showUserPreview, setShowUserPreview] = useState(false);
  const ChatState = useChatStore((state) => state);

  const modalState = useModalStore();

  const showChatRooms = useChatStore((state) => state.showChatRooms);
  const toggleChatRooms = useChatStore((state) => state.toggleChatRooms);

  const selectedChatType = useChatStore((state) => state.selectedChatType);

  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };

  return (
    <>
      <div className="flex h-full bg-[#1A1C26] relative">
        <div>
          {modalState.showExploreModal && <ExploreRoomsModal />}
          {modalState.showSettingsModal && <RoomSettingsModal />}
          {modalState.showAddUsersModal && <AddUsersModal />}
          {modalState.showCreateChatRoomModal && <CreateNewRoomModal />}
        </div>
        <div
          className={classNames(
            showUserPreview === true
              ? "w-4/5 lg:w-4/12 max-w-lg "
              : "w-4/5 lg:w-4/12  max-w-lg  ",
            "absolute lg:relative h-full min-w-[360px] lg:border-r-2 border-base-200",
            "z-20 transition-transform transform data-[mobile-show=true]:translate-x-0 data-[mobile-show=false]:-translate-x-[1000px] lg:!transform-none lg:!transition-none duration-300",
          )}
          data-mobile-show={showChatRooms}
        >
          {selectedChatType === ChatType.Chat && <RecentConversations />}
          {selectedChatType === ChatType.Room && <RoomChatPlaceHolder />}
        </div>
        {showChatRooms && (
          <div
            className="z-10 absolute inset-0 lg:hidden bg-black/40"
            onClick={() => toggleChatRooms()}
          />
        )}
        <div className={` ${"w-auto flex-1"} overflow-hidden bg-gray-900`}>
          {ChatState.selectedChatID === "1" ? (
            <InitChatPlaceholder />
          ) : (
            <Conversation onRemoveUserPreview={handleRemoveUserPreview} />
          )}
        </div>
        <div
          className={` ${
            showUserPreview
              ? "w-full absolute inset-0 lg:w-3/12 lg:relative"
              : "!hidden"
          }  bg-[#1A1C26] lg:border-l-2 border-black`}
        >
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
  const [isLoading, setIsLoading] = useState(false);
  const [currentUsers, setUsers] = useState<RoomMember[]>([]);
  const LayoutState = useModalStore((state) => state);
  const SelectedChat = useChatStore((state) => state.selectedChatID);
  const navigate = useNavigate();

  const currentUser = useChatStore((state) => state.currentDmUser);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const currentRoom = chatRooms.find((room) => room.id === SelectedChat);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (SelectedChat === "1" && selectedChatType !== ChatType.Room) {
          onRemoveUserPreview();
        } else {
          setIsLoading(true);
          await getRoomMembersCall(SelectedChat as string, 0, 20).then(
            (res) => {
              if (res?.status === 200 || res?.status === 201) {
                const extractedData = res.data;
                setIsLoading(false);
                setUsers(extractedData);
              }
            },
          );
        }
      } catch (error) {
        // Do nothing
      }
    };

    fetchData();

    //eslint-disable-next-line
  }, [SelectedChat]);
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

        <button
          onClick={() => {
            LayoutState.setShowPreviewCard(false);
            onRemoveUserPreview();
          }}
        >
          <img alt="" src={Close} />
        </button>
      </div>
      <div className="flex flex-row justify-center p-4">
        <img
          className="w-36 rounded-full "
          alt=""
          src={
            selectedChatType === ChatType.Chat
              ? currentUser?.avatar.large
              : groupIcon
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
            <p className="text-center  p-1 pt-2 font-poppins font-normal whitespace-normal overflow-auto break-words ">
              {currentUser?.bio ?? "NO"}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <div className="flex flex-row  text-gray-400 font-poppins font-medium text-base ">
            <img alt="" src={RoomsIcon} />
            <p className="pl-2 ">{currentRoom?.name}'s Members</p>
          </div>
          <div className="h-[350px] overflow-scroll no-scrollbar ">
            {isLoading === false ? (
              <>
                {currentUsers.map((user) => (
                  <div key={user?.id} className="felx flex-row p-5">
                    <div className="flex items-center justify-start space-x-2">
                      <div className="avatar">
                        <div className="mask mask-squircle w-11 h-11">
                          <button
                            onClick={() => navigate(`/profile/${user.id}`)}
                          >
                            <img
                              className="w-12 rounded-full "
                              alt=""
                              src={user?.avatar?.medium ?? NullUser}
                            />
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400 font-poppins font-medium text-base max-w-[80px] md:max-w-[180px]  truncate">
                          {user?.firstname ?? "user"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="text-center p-2">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              </>
            )}
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
