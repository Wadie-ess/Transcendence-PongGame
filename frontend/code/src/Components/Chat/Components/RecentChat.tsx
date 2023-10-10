import { useState } from "react";
import { ChatType, useChatStore } from "../Controllers/ChatControllers";
import { ChatPaceHolderProps } from "./Conversation";
import users, {
  ChatIcon,
  GroupChat,
  RoomsIcon,
  UserImage,
  check,
  yas1,
  yas2,
  yas3,
  yas4,
} from "./tools/Assets";
import { SelectedUserTile } from "..";
import {
  CreateNewRoomModal,
  DialogAlertConfirmation,
  RoomChatPlaceHolder,
  RoomSettingsModal,
} from "./RoomChatHelpers";

export const RecentConversations = () => {
  const [MyUsers] = useState(users);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  return selectedChatType === ChatType.Chat ? (
    <div className="h-full flex flex-col">
      <OnlineNowUsers />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {MyUsers.filter((friend) => friend.messages.length > 0).map(
          // to change 0 to the last message here
          (friend) => (
            <ChatPlaceHolder
              key={friend.id}
              id={friend.id}
              username={friend.name}
              message={friend.messages[friend.messages.length - 1].message}
              time={friend.messages[friend.messages.length - 1].time}
              isMe={true}
              isRead={true}
              userImage={friend.image}
            />
          )
        )}
      </div>
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
}: ChatPaceHolderProps) => {
  const selectNewChat = useChatStore((state) => state.selectNewChatID);
  const selectedChatID = useChatStore((state) => state.selectedChatID);

  return (
    <div
      onClick={() => selectNewChat(id)}
      className={`message-container flex   pt-5 pl-5 pb-5 pr-2  hover:bg-[#272932]   ${
        selectedChatID === id ? "bg-[#272932]" : "bg-[#1A1C26]"
      }
          
            `}
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
          <p className="text-white font-poppins text-base font-normal leading-normal ">
            {username}
          </p>
          <p className="text-gray-400 font-poppins text-sm font-light leading-normal ">
            {time} PM
          </p>
        </div>
        <div className=" flex flex-row justify-between">
          <p className="text-gray-400 font-poppins text-sm font-medium leading-normal max-w-[200px] truncate ">
            {message ?? "h"}
          </p>
          {isRead === false ? (
            <div className="messages-dot relative inline-flex">
              <div className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center">
                <span className="text-xs  font-medium">5</span>
              </div>
            </div>
          ) : (
            <img alt="" src={check} />
          )}
        </div>
      </div>
    </div>
  );
};

export const OnlineNowUsers = () => {
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const changeChatType = useChatStore((state) => state.changeChatType);

  return (
    <>
      <div className="online-now-container    pt-5 pl-5 pb-2 pr-3 bg-[#1A1C26]">
        <div className="messages-header flex flex-row justify-between pb-2">
          <p className="text-purple-500 font-poppins text-lg font-medium leading-normal ">
            Messages
          </p>
          <div className="icons-row flex flex-row  ">
            <a href="#my_modal_8" className="">
              <img className="" alt="" src={GroupChat} />
            </a>
            <div>
              <RoomSettingsModal />

              <CreateNewRoomModal />
            </div>
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
              <p className="text-gray-300 font-poppins text-base font-medium leading-normal pr-3 ">
                Chat
              </p>
              <img src={ChatIcon}></img>
            </div>
          </button>
          <button
            onClick={() => changeChatType(ChatType.Room)}
            className={`${
              selectedChatType === ChatType.Room ? "bg-[#272932]" : ""
            } flex-1 p-2 rounded  `}
          >
            <div className="flex flex-row justify-center">
              <p className="text-gray-300 font-poppins text-base font-medium leading-normal pr-3">
                Rooms
              </p>
              <img src={RoomsIcon}></img>
            </div>
          </button>
        </div>
        <div className="message-row flex flex-row pt-2 justify-between">
          <p className="text-gray-400 font-poppins text-xs font-medium leading-normal ">
            Online Now
          </p>
        </div>
        <div className="users-images flex flex-row justify-between pt-3 pb-3 ">
          <div className="relative inline-block">
            <img
              className="user-image h-10 w-10 rounded-full"
              src={UserImage}
              alt={`second's Profile`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="relative inline-block">
            <img
              className="user-image h-10 w-10 rounded-full"
              src={yas1}
              alt={`second's Profile`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="relative inline-block">
            <img
              className="user-image h-10 w-10 rounded-full"
              src={yas2}
              alt={`second's Profile`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="relative inline-block">
            <img
              className="user-image h-10 w-10 rounded-full"
              src={yas3}
              alt={`second's Profile`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="relative inline-block">
            <img
              className="user-image h-10 w-10 rounded-full"
              src={yas4}
              alt={`second's Profile`}
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};
