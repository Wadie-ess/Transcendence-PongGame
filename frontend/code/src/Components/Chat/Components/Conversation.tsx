import { useEffect, useRef, useState } from "react";
import { ConversationProps } from "..";
import users, {
  Message,
  groupIcon,
  chatRooms,
  More,
  Send,
} from "./tools/Assets";
import { ChatType, useChatStore } from "../Controllers/ChatControllers";

import {
  ConfirmationModal,

  NullPlaceHolder,

} from "./RoomChatHelpers";
import { KeyboardEvent } from "react";

export interface ChatPaceHolderProps {
  username: string;
  message: string;
  time: string;
  isMe: boolean;
  isRead: boolean;
  userImage: string;
  id: number;
}

export const CurrentUserMessage = ({
  message,
  time,
  // isRead,
  senderId,
}: Message) => {
  const [MyUsers] = useState(users);

  const SelectedChat = useChatStore((state) => state.selectedChatID);
  const selectedChatType = useChatStore((state) => state.selectedChatType);

  const currentChatMessages = MyUsers.find((user) => user.id === SelectedChat);

  return senderId === 2 ? (
    <div className="chat chat-end p-2 pl-5 ">
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          12:45 PM
        </time>
      </div>
      <div className="max-w-max chat-bubble bg-purple-500 text-white whitespace-normal break-words text-sm md:text-base w-[60%] inline-block  ">
        {message}
      </div>
      <div className="chat-footer p-1 text-gray-400 font-poppins text-xs font-light leading-normal">
        Delivered
      </div>
    </div>
  ) : (
    <div className="chat chat-start p-3 pr-5">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {selectedChatType === ChatType.Chat ? (
            <img src={currentChatMessages?.image} alt="" />
          ) : (
            <img
              src={MyUsers.find((user) => user.id === senderId)?.image}
              alt=""
            />
          )}
        </div>
      </div>
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {time} PM
        </time>
      </div>

      <div className="max-w-max chat-bubble whitespace-normal text-sm md:text-base   break-words w-[60%] inline-block">
        {message}
      </div>
    </div>
  );
};

export const ConversationHeader: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const [MyUsers] = useState(users);

  const SelectedChat = useChatStore((state) => state.selectedChatID);

  const currentUser = MyUsers.find((user) => user.id === SelectedChat);
  const selectedChatType = useChatStore((state) => state.selectedChatType);

  const currentRoom = chatRooms.find((room) => room.id === SelectedChat);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to handle the confirmation
  const handleConfirmation = () => {
    // Perform your action when the user confirms (e.g., delete item)
    // For this example, we'll just close the modal
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-row justify-between bg-[#1A1C26] p-3 border-b-2  border-black  ">
        <div className="flex flex-row ">
          <div className="pr-1">
            <img
              className="w-12 rounded-full "
              alt=""
              src={
                selectedChatType === ChatType.Chat
                  ? currentUser?.image
                  : groupIcon
              }
            />
          </div>
          <div className="flex flex-col pl-2 ">
            <p className="text-white font-poppins text-base font-medium leading-normal">
              {selectedChatType === ChatType.Chat
                ? currentUser?.name
                : currentRoom?.name}
            </p>
            {selectedChatType === ChatType.Chat ? (
              <p className="text-green-500 font-poppins text-sm font-medium leading-normal">
                online
              </p>
            ) : (
              <p className="text-gray-500 font-poppins text-sm font-medium leading-normal">
                {currentRoom?.usersId.length} members
              </p>
            )}
          </div>
        </div>
        {selectedChatType === ChatType.Chat ? (
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
                <span className="hover:bg-[#7940CF]">
                  invite for a Pong Game
                </span>
              </li>
              <li className="hidden md:block">
                <span
                  onClick={onRemoveUserPreview}
                  className="hover:bg-[#7940CF]"
                >
                  Show User Info
                </span>
              </li>
            </ul>
          </div>
        ) : (
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
              {/* check if current user is admin or owner to show the settings toast */}
              {currentRoom?.isAdmin || currentRoom?.isOwner ? (
                <div className="icons-row flex flex-row  ">
                  <a href="#my_modal_9" className="">
                    <li>
                      <span className="hover:bg-[#7940CF]">
                        Edit Room Settings
                      </span>
                    </li>
                  </a>
                </div>
              ) : (
                <></>
              )}

              <li className="hidden md:block">
                <span
                  onClick={onRemoveUserPreview}
                  className="hover:bg-[#7940CF]"
                >
                  Show Room Info
                </span>
              </li>
              <div>
                <li>
                  <span onClick={openModal} className="hover:bg-[#7940CF]">
                    leave The Room
                  </span>
                </li>
              </div>
            </ul>
            <ConfirmationModal
              isOpen={isModalOpen}
              onConfirm={handleConfirmation}
            />
          </div>
        )}
      </div>
    </>
  );
};

export const Conversation: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const currentChatMessages = useChatStore((state) => state.currentMessages);
  const currentRoomMessages = useChatStore(
    (state) => state.currentRoomMessages
  );
  const pushMessage = useChatStore((state) => state.addNewMessage);
  const [inputValue, setInputValue] = useState("");

  const selectedMessages =
    selectedChatType === ChatType.Chat
      ? currentChatMessages
      : currentRoomMessages;
  // Function to handle input changes
  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInputValue(e.target.value); // Update the input value in state
  };

  // Use the useEffect hook to scroll to the end when the component mounts
  useEffect(() => {
    scrollToBottom();
  }, [selectedMessages]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // validation check
      if (inputValue.length > 0) {
        pushMessage({
          senderId: 2,
          message: inputValue,
          isRead: false,
          time: "10",
        });
        setInputValue("");
      }
    }
    // do stuff
  };

  return (selectedMessages?.length as number) > 0 ? (
    <div className="flex flex-col h-[99%] ">
      <ConversationHeader onRemoveUserPreview={onRemoveUserPreview} />
      <div
        className="flex-grow overflow-y-auto no-scrollbar"
        ref={messageContainerRef}
      >
        {(selectedMessages?.length as number) > 0 ? (
          selectedMessages?.map((message) => (
            <CurrentUserMessage
              message={message.message}
              time={message.time}
              senderId={message.senderId}
              isRead={message.isRead}
            />
          ))
        ) : (
          <NullPlaceHolder message="No Messages Yet!, be The First" />
        )}
      </div>

      <div className=" bottom-2   ">
        <div className="">
          <div className="flex flex-row  m-5 justify-evenly ">
            <div className="flex flex-row w-full justify-center ">
              <input
                value={inputValue}
                onKeyDown={handleKeyPress}
                onChange={handleInputChange}
                type="text"
                placeholder="Type Message "
                className="input w-full shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-base font-poppins text-base font-normal leading-normal "
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
  ) : (
    <NullPlaceHolder message="No Conversation Yet!, Be The First " />
  );
};
