import {
  More,
  Send,
  Close,
  Bio,
  NullImage,
} from "./Components/tools/Assets";
import { useState } from "react";
import {
  CurrentUserMessage,
  ChatPlaceHolder,
  OnlineNowUsers,
} from "./Components/MessageHelpers";
import { ChatPaceHolderProps } from "./Components/MessageHelpers";
import users from "./Components/tools/Assets";
import React, { useEffect, useRef } from "react";
import { useBearStore } from "./Controllers/ChatState";


interface ConversationProps {
  onRemoveUserPreview: () => void;
}

export const Chat = () => {
  const [showUserPreview, setShowUserPreview] = useState(true);

  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };
  return (
    <>
      <div className="flex h-full divide-black divide-x-4">
        <div className={` ${showUserPreview ? "w-4/12" : "w-4/12"}`}>
          {<RecentConversations />}
        </div>
        <div
          className={` ${
            showUserPreview ? "w-6/12" : "w-8/12"
          } overflow-hidden bg-gray-900`}
        >
          <Conversation onRemoveUserPreview={handleRemoveUserPreview} />
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
  const [MyUsers] = useState(users);

  const SelectedChat = useBearStore((state) => state.selectedChatID);

  const currentUser = MyUsers.find((user) => user.id === SelectedChat);
  return (
    <div className="flex flex-col p-4 ">
      <div className="flex flex-row justify-between ">
        <p className="text-white font-poppins font-light text-base">
          {currentUser?.name}'s Info
        </p>
        <button onClick={onRemoveUserPreview}>
          <img alt="" src={Close} />
        </button>
      </div>
      <div className="flex flex-row justify-center p-4">
        <img className="w-36 rounded-full " alt="" src={currentUser?.image} />
      </div>
      <div className="flex flex-row justify-center p-1 text-white font-poppins text-26 font-medium">
        <p>{currentUser?.name}</p>
      </div>
      <div className="flex flex-row justify-center p-1 text-gray-400 font-poppins font-medium text-base">
        <p>Friend</p>
      </div>
      <div className="flex flex-row  text-gray-400 font-poppins font-medium text-base ">
        <img alt="" src={Bio} />
        <p className="pl-2">{currentUser?.name}'s Bio</p>
      </div>
      <div className=" bg-[#1A1C26]">
        <p className="text-white  p-1 pt-2 font-poppins font-normal whitespace-normal overflow-auto break-words">
          hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
        </p>
      </div>
    </div>
  );
};

export const ConversationHeader: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const [MyUsers] = useState(users);

  const SelectedChat = useBearStore((state) => state.selectedChatID);

  const currentUser = MyUsers.find((user) => user.id === SelectedChat);
  return (
    <>
      <div className="flex flex-row justify-between bg-[#1A1C26] p-3 border-b-2  border-black  ">
        <div className="flex flex-row ">
          <div className="pr-1">
            <img
              className="w-12 rounded-full "
              alt=""
              src={currentUser?.image}
            />
          </div>
          <div className="flex flex-col pl-2 ">
            <p className="text-white font-poppins text-base font-medium leading-normal">
              {currentUser?.name}
            </p>
            <p className="text-green-500 font-poppins text-sm font-medium leading-normal">
              Online
            </p>
          </div>
        </div>

        <div className="dropdown">
          <label tabIndex={0} className="">
            <summary className="list-none p-3 cursor-pointer ">
              <img src={More} alt="More" />
            </summary>
          </label>
          <ul
            tabIndex={0}
            className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute  right-full  "
          >
            <li>
              <span className="hover:bg-[#7940CF]">Block</span>
            </li>
            <li>
              <span className="hover:bg-[#7940CF]">invite for a Pong Game</span>
            </li>
            <li>
              <span
                onClick={onRemoveUserPreview}
                className="hover:bg-[#7940CF]"
              >
                Show User Info
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export const Conversation: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const currentChatMessages = useBearStore((state) => state.currentMessages);
  const pushMessage = useBearStore((state) => state.addNewMessage);
  const [inputValue, setInputValue] = useState("");

  // Function to handle input changes
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputValue(e.target.value); // Update the input value in state
  };

  // Use the useEffect hook to scroll to the end when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, [currentChatMessages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-[99%] ">
      <ConversationHeader onRemoveUserPreview={onRemoveUserPreview} />
      <div
        className="flex-grow overflow-y-auto no-scrollbar"
        ref={messageContainerRef}
      >
        {(currentChatMessages?.length as number) > 0 ? (
          currentChatMessages?.map((message) => (
            <CurrentUserMessage
              message={message.message}
              time={message.time}
              senderId={message.senderId}
              isRead={message.isRead}
            />
          ))
        ) : (
          <>
            <div className="null image flex flex-col justify-center items-center h-full">
              <img alt="null" className="w-[20%] bottom-2" src={NullImage}></img>
              <p className="text-gray-500 font-montserrat text-18 font-semibold leading-28">
                No Messages for now, be The Firs !
              </p>
            </div>
          </>
        )}
      </div>

      <div className=" bottom-2   ">
        <div className="">
          <div className="flex flex-row  m-5 justify-evenly ">
            <div className="flex flex-row w-full justify-center ">
              <input
                value={inputValue}
                onChange={handleInputChange}
                type="text"
                placeholder="Type Message"
                className="input w-full shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 font-poppins text-base font-normal leading-normal "
              />

              <button
                onClick={() => {
                  setInputValue("");

                  if (inputValue.length > 0) {
                    pushMessage({
                      senderId: 2,
                      message: inputValue,
                      isRead: false,
                      time: "10",
                    });
                  }
                }}
                className="btn  ml-4 btn-square  bg-[#8C67F6] hover:bg-green-600"
              >
                <img src={Send} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecentConversations = () => {
  const [MyUsers] = useState(users);

  return (
    <div className="h-full flex flex-col">
      {/* <p>{SelectedChat}</p> */}
      <OnlineNowUsers />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {MyUsers.filter((friend) => friend.messages.length > 0).map(
          // to change 0 to the last message here 
          (friend) => (
            <ChatPlaceHolder
              key={friend.id}
              id={friend.id}
              username={friend.name}
              message={friend.messages[0].message}
              time={friend.messages[0].time}
              isMe={true}
              isRead={true}
              userImage={friend.image}
            />
          )
        )}
      </div>
    </div>
  );
};

// to refactor it and make it a dynamic list of 5

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
