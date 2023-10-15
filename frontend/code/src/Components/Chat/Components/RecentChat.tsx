import { useState } from "react";
import { ChatType, useChatStore } from "../Controllers/ChatControllers";
import { ChatPaceHolderProps } from "./Conversation";
import users, {
  ChatIcon,
  Explore,
  GroupChat,
  RoomsIcon,
  check,
} from "./tools/Assets";

import {
  AddUsersModal,
  CreateNewRoomModal,
  ExploreRoomsModal,
  NullPlaceHolder,
  RoomChatPlaceHolder,
  RoomSettingsModal,
} from "./RoomChatHelpers";
import { useDisclosure } from "@mantine/hooks";

import {
  Dialog,
  Group,
  Button,
  TextInput,
  Text,
  Popover,
  Modal,
  RingProgress,
} from "@mantine/core";

export const RecentConversations = () => {
  const [MyUsers] = useState(users);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  return selectedChatType === ChatType.Chat ? (
    <div className="h-full flex flex-col ">
      <OnlineNowUsers />
      {MyUsers.length > 0 ? (
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
      ) : (
        <NullPlaceHolder message="No Conversation Yet!, Be The First" />
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
}: ChatPaceHolderProps) => {
  const selectNewChat = useChatStore((state) => state.selectNewChatID);
  const selectedChatID = useChatStore((state) => state.selectedChatID);

  return (
    <div
      onClick={() => selectNewChat(id)}
      className={`message-container flex   pt-5 pl-5 pb-5 pr-2  hover:bg-[#272932] items-center  ${
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
          <p className="text-white font-poppins text-sm md:text-base font-normal leading-normal ">
            {username}
          </p>
          <p className="text-gray-400 font-poppins text-sm font-light leading-normal hidden md:block ">
            {time} PM
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

function Demo() {
  return (
    <Popover width={200} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button>Toggle popover</Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">
          This is uncontrolled popover, it is opened when button is clicked
        </Text>
      </Popover.Dropdown>
    </Popover>
  );
}
export const OnlineNowUsers = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const changeChatType = useChatStore((state) => state.changeChatType);
  const [Users] = useState(users);
  // take the first five users from the array
  const onlineUsers = Users.slice(0, 5);

  return (
    <>
      <div className="online-now-container    pt-5 pl-5 pb-2 pr-3 bg-[#1A1C26]">
        <div className="messages-header flex flex-row justify-between pb-2">
          <p className="text-purple-500 font-poppins text-sm md:text-lg font-medium leading-normal ">
            Messages
          </p>
          <div className="icons-row flex flex-row items-center  ">
            <a href="#my_modal_5" className="pr-3">
              <img className="w-[100%]" alt="" src={Explore} />
            </a>
            <a href="#my_modal_8" className="">
              <img className="w-[80%]" alt="" src={GroupChat} />
            </a>
            <div>
              <ExploreRoomsModal/>
              <RoomSettingsModal />
              <AddUsersModal />
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
              <div className="relative inline-block">
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
