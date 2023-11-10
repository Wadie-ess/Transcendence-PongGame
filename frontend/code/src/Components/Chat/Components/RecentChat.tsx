import { useEffect, useState } from "react";
import { ChatType, useChatStore } from "../Controllers/RoomChatControllers";
import { ChatPaceHolderProps } from "./Conversation";
import users, {
  ChatIcon,
  DmRoom,
  Explore,
  GroupChat,
  RoomsIcon,
  check,
} from "./tools/Assets";

import { NullPlaceHolder, RoomChatPlaceHolder } from "./RoomChatHelpers";
import { useModalStore } from "../Controllers/LayoutControllers";
import { fetchDmsCall } from "../Services/ChatServices";
import { formatTime } from "./tools/utils";
import { useSocketStore } from "../Services/SocketsServices";
import { useUserStore } from "../../../Stores/stores";

export const RecentConversations = () => {
  const [isLoading, setLoading] = useState(false);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const ChatRoomsState = useChatStore((state) => state);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      await fetchDmsCall(0, 20).then((res) => {
        setLoading(false);
        if (res?.status !== 200 && res?.status !== 201) {
        } else {
          const rooms: DmRoom[] = [];
          res.data.forEach(
            (room: {
              secondMemberId: string;
              id: string;
              last_message?: {
                content?: string;
                createdAt?: string;
              };
              name: string;

              avatar: {
                thumbnail: string;
                medium: string;
                large: string;
              };
              bio: string;
            }) => {
              rooms.push({
                secondUserId: room.secondMemberId,
                id: room.id,
                name: room.name,
                avatar: room.avatar,
                last_message: {
                  content: room.last_message?.content,
                  createdAt: room.last_message?.createdAt,
                },
                bio: room.bio,
              });
            }
          );
          // setIsLoading(false);
          ChatRoomsState.fillRecentDms(rooms);
        }
      });
    };
    fetch();
    // eslint-disable-next-line
  }, [ChatRoomsState.selectedChatID, ChatRoomsState.selectedChatType]);

  return selectedChatType === ChatType.Chat ? (
    <div className="h-full flex flex-col ">
      <OnlineNowUsers />
      {ChatRoomsState.recentDms.length > 0 ? (
        <div className="flex-grow overflow-y-auto no-scrollbar bg-[#1A1C26]">
          {ChatRoomsState.recentDms.map((friend) => (
            <ChatPlaceHolder
              key={friend.id}
              secondUserId={friend.secondUserId}
              id={friend.id}
              username={friend.name}
              message={friend.last_message?.content ?? "No Messages*"}
              time={friend.last_message?.createdAt ?? ""}
              isMe={true}
              isRead={true}
              userImage={friend.avatar.medium}
            />
          ))}
        </div>
      ) : (
        <>
          {isLoading === true ? (
            <div className="text-center">
              <span className="loading loading-spinner loading-lg "></span>
            </div>
          ) : (
            <NullPlaceHolder message="No Conversation Yet!, Be The First" />
          )}
        </>
      )}
    </div>
  ) : (
    <div className="h-full flex flex-col">
      <OnlineNowUsers />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        <RoomChatPlaceHolder />
      </div>
    </div>
  );
};

export const ChatPlaceHolder = ({
  username,
  message,
  time,
  isRead,
  userImage,
  id,
  secondUserId,
}: ChatPaceHolderProps) => {
  const selectNewChat = useChatStore((state) => state.selectNewChatID);
  const selectedChatID = useChatStore((state) => state.selectedChatID);
  const chatState = useChatStore((state) => state);
  const socketStore = useSocketStore();
  const currentUser = useUserStore((state) => state);
  return (
    <div
      onClick={() => {
        if (selectedChatID !== id) {
          // socketStore.socket.emit("joinRoom", {
          //   memberId: currentUser.id,
          //   roomId: id,
          // });
          selectNewChat(id);
        }
        chatState.setCurrentDmUser({
          secondUserId: secondUserId,
          id: id,
          name: username,
          avatar: {
            thumbnail: userImage,
            medium: userImage,
            large: userImage,
          },
        });
      }}
      className={`message-container flex   px-4 py-5  hover:bg-[#272932] items-center  ${
        selectedChatID === id ? "bg-[#272932]" : "bg-[#1A1C26]"
      }`}
    >
      <div className="user-image flex-shrink-0 mr-2">
        <img
          className="user-image h-10 w-10 rounded-full"
          src={userImage}
          alt={`second's Profile`}
        />
      </div>
      <div className="message-colum align-middle flex flex-col flex-grow">
        <div className="message-row flex flex-row justify-between">
          <p className="text-white font-poppins text-sm md:text-base font-normal leading-normal ">
            {username}
          </p>
          <p className="text-gray-400 font-poppins text-xs font-light leading-normal">
            {formatTime(time)}
          </p>
        </div>
        <div className=" flex flex-row justify-between">
          <p className="text-gray-400 font-poppins text-sm font-medium leading-normal max-w-[80px] md:max-w-[180px]  truncate hidden md:block ">
            {message ?? "h"}
          </p>
          {isRead === false ? (
            <div className="messages-dot relative inline-flex">
              <div className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center">
                <span className="text-xs  font-medium">5</span>
              </div>
            </div>
          ) : (
            <img alt="" className="hidden md:block" src={check} />
          )}
        </div>
      </div>
    </div>
  );
};

export const OnlineNowUsers = () => {
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const changeChatType = useChatStore((state) => state.changeChatType);
  const [Users] = useState(users);
  // take the first five users from the array
  const onlineUsers = Users.slice(0, 5);
  const setModalState = useModalStore((state) => state.setShowExploreModal);

  return (
    <>
      <div className="online-now-container    p-5 bg-[#1A1C26]">
        <div className="messages-header flex flex-row justify-between pb-2">
          <p className="text-purple-500 font-poppins text-sm md:text-lg font-medium leading-normal ">
            Messages
          </p>
          <div className="icons-row flex flex-row items-center  ">
            <a href="#my_modal_8" className="pr-2">
              <img className="w-[80%]" alt="" src={GroupChat} />
            </a>
            <a href="#my_modal_5" className="">
              <img
                className="w-[100%]"
                alt=""
                onClick={() => setModalState(true)}
                src={Explore}
              />
            </a>
          </div>
        </div>
        <div className="Message-Type-Buttons flex flex-row pt-2 pb-2 justify-between ">
          <button
            onClick={() => changeChatType(ChatType.Chat)}
            className={`${
              selectedChatType === ChatType.Chat ? "bg-[#272932]" : ""
            } flex-1 p-2 rounded ] `}
          >
            <div className=" flex flex-row justify-center ">
              <p className="text-gray-300 font-poppins text-base font-medium leading-normal pr-3 hidden md:block ">
                Chat
              </p>
              <img alt="chat" src={ChatIcon}></img>
            </div>
          </button>
          <button
            onClick={() => changeChatType(ChatType.Room)}
            className={`${
              selectedChatType === ChatType.Room ? "bg-[#272932]" : ""
            } flex-1 p-2 rounded  `}
          >
            <div className="flex flex-row justify-center">
              <p className="text-gray-300 font-poppins text-base font-medium leading-normal pr-3 hidden md:block">
                Rooms
              </p>
              <img alt="chat" src={RoomsIcon}></img>
            </div>
          </button>
        </div>
        <div className="hidden md:block">
          <div className="message-row flex flex-row pt-2 justify-between">
            <p className="text-gray-400 font-poppins text-xs font-medium leading-normal ">
              Online Now
            </p>
          </div>
          <div className="users-images flex flex-row justify-between pt-3 pb-3  ">
            {onlineUsers.map((user) => (
              <div key={user.id} className="relative inline-block">
                <img
                  className="user-image h-10 w-10 rounded-full"
                  src={user.image}
                  alt={`second's Profile`}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
