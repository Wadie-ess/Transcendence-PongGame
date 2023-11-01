import { useEffect, useRef, useState } from "react";
import { ConversationProps } from "..";
import users, {
  Message,
  groupIcon,
  chatRooms,
  More,
  Send,
} from "./tools/Assets";
import { ChatType, useChatStore } from "../Controllers/RoomChatControllers";

import { ChatPlaceHolder, ConfirmationModal } from "./RoomChatHelpers";
import { KeyboardEvent } from "react";
import { leaveRoomCall } from "../Services/ChatServices";
import toast from "react-hot-toast";
import { useModalStore } from "../Controllers/LayoutControllers";
import {
  getRoomMessagesCall,
  sendMessageCall,
} from "../Services/MessagesServices";

import { useUserStore } from "../../../Stores/stores";
import { formatTime } from "./tools/utils";
import { socket } from "../Services/SocketsServices";

export interface ChatPaceHolderProps {
  username: string;
  message: string;
  time: string;
  isMe: boolean;
  isRead: boolean;
  userImage: string;
  id: string;
}

export const CurrentUserMessage = ({
  message,
  time,
  senderId,
  avatar,
}: Message) => {
  const [MyUsers] = useState(users);
  const currentUser = useUserStore((state) => state);

  const SelectedChat = useChatStore((state) => state.selectedChatID);
  const selectedChatType = useChatStore((state) => state.selectedChatType);

  const currentChatMessages = MyUsers.find((user) => user.id === SelectedChat);

  return senderId === currentUser.id ? (
    <div className="chat chat-end p-2 pl-5 ">
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {formatTime(time)}
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
          <img src={avatar?.medium} alt="" />
        </div>
      </div>
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {formatTime(time)}
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

  const LayoutState = useModalStore((state) => state);
  const ChatState = useChatStore((state) => state);
  const SelectedChat = useChatStore((state) => state.selectedChatID);

  const currentUser = MyUsers.find((user) => user.id === SelectedChat);
  const selectedChatType = useChatStore((state) => state.selectedChatType);

  const currentRoom = chatRooms.find((room) => room.id === SelectedChat);

  const toggleChatRooms = useChatStore((state) => state.toggleChatRooms);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirmation = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-row justify-between bg-[#1A1C26] p-3 border-b-2  border-black  ">
        <div className="flex flex-row ">
          <div className="flex items-center justify-center h-full mr-4 lg:hidden">
            <button
              className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center hover:bg-slate-600"
              onClick={() => toggleChatRooms()}
            >
              =
            </button>
          </div>

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
                : currentRoom?.isOwner
                ? currentRoom.name + " ♚"
                : currentRoom?.name}
            </p>
            {selectedChatType === ChatType.Chat ? (
              <p className="text-green-500 font-poppins text-sm font-medium leading-normal">
                online
              </p>
            ) : (
              <p className="text-gray-500 font-poppins text-sm font-medium leading-normal">
                {currentRoom?.membersCount} members
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
              <li
                onClick={() => {
                  LayoutState.setShowPreviewCard(!LayoutState.showPreviewCard);
                  onRemoveUserPreview();
                }}
                className="hidden md:block"
              >
                <span className="hover:bg-[#7940CF]">
                  {LayoutState.showPreviewCard === false
                    ? "Show User Info"
                    : "hide User Info"}
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
              {(currentRoom?.isAdmin === true ||
                currentRoom?.isOwner === true) && (
                <div className="icons-row flex flex-col  ">
                  <a
                    onClick={() => {
                      LayoutState.setShowSettingsModal(
                        !LayoutState.showSettingsModal
                      );
                    }}
                    href="#my_modal_9"
                    className=""
                  >
                    <li>
                      <span className="hover:bg-[#7940CF]">
                        Edit Room Settings
                      </span>
                    </li>
                  </a>
                  <a
                    onClick={() => {
                      LayoutState.setShowAddUsersModal(
                        !LayoutState.showAddUsersModal
                      );
                    }}
                    href="#my_modal_6"
                    className=""
                  >
                    <li>
                      <span className="hover:bg-[#7940CF]">Add Users</span>
                    </li>
                  </a>
                </div>
              )}

              <li
                onClick={() => {
                  LayoutState.setShowPreviewCard(!LayoutState.showPreviewCard);
                  onRemoveUserPreview();
                }}
                className="hidden md:block"
              >
                <span className="hover:bg-[#7940CF]">
                  {LayoutState.showPreviewCard === false
                    ? "Show Room Info"
                    : "hide Room Info"}
                </span>
              </li>
              {currentRoom?.isOwner === false && (
                <div>
                  <li
                    onClick={async () => {
                      ChatState.setIsLoading(true);
                      await leaveRoomCall(currentRoom?.id as string).then(
                        (res) => {
                          ChatState.setIsLoading(false);
                          if (res?.status === 200 || res?.status === 201) {
                            toast.success("Room Left Successfully");
                            ChatState.deleteRoom(currentRoom?.id as string);
                          }
                        }
                      );
                    }}
                  >
                    <span className="hover:bg-[#7940CF]">leave The Room</span>
                  </li>
                </div>
              )}
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
  const chatState = useChatStore((state) => state);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      const container = messageContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const currentUser = useUserStore((state) => state);
  const [inputValue, setInputValue] = useState("");
  const [FailToSendMessage, setFail] = useState(false);

  const handleInputChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setFail(false);
    setInputValue(e.target.value);
  };

  useEffect(() => {
    function onConnect() {
      console.log("hello");
    }

    socket.on("connect", onConnect);

    socket.on(
      "message",
      (message: {
        id: string;
        avatar: {
          thumbnail: string;
          medium: string;
          large: string;
        };
        content: string;
        time: string;
        roomId: string;
        authorId: string;
      }) => {
        console.log(message);
        if (message.roomId === chatState.selectedChatID) {
          const NewMessage: Message = {
            avatar: message.avatar,
            senderId: message.authorId,
            message: message.content,
            time: message.time,
          };

          if (
            chatState.currentMessages.findIndex(
              (message) => message.id === NewMessage.id
            ) === -1
          ) {
            chatState.pushMessage(NewMessage);
          }
        }
        scrollToBottom();
      }
    );

    const fetch = async () =>
      getRoomMessagesCall(chatState.selectedChatID, 0, 30).then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
        } else {
          const messages: Message[] = [];
          res.data.forEach(
            (message: {
              id: string;
              avatar: {
                thumbnail: string;
                medium: string;
                large: string;
              };
              content: string;
              time: string;
              roomId: string;
              authorId: string;
            }) => {
              messages.push({
                avatar: message.avatar,
                senderId: message.authorId,
                message: message.content,
                time: message.time,
              });
            }
          );
          chatState.fillCurrentMessages(messages.reverse());
        }
      });

    fetch().then((res) => {
      scrollToBottom();
    });
  }, [chatState.selectedChatID]);

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (inputValue.length > 0) {
        chatState.pushMessage({
          avatar: {
            thumbnail: "",
            medium: "",
            large: "",
          },
          senderId: currentUser.id,
          message: inputValue,
          time: Date().toString(),
        });

        scrollToBottom();

        setInputValue("");
      }
    }
    // do stuff
  };

  return (
    <div className="flex flex-col h-[99%] ">
      <ConversationHeader onRemoveUserPreview={onRemoveUserPreview} />
      <div
        className="flex-grow overflow-y-auto no-scrollbar "
        ref={messageContainerRef}
      >
        {(chatState.currentMessages?.length as number) > 0 ? (
          chatState.currentMessages?.map((message) => (
            <CurrentUserMessage
              key={message.id}
              avatar={message.avatar}
              message={message.message}
              time={message.time}
              senderId={message.senderId}
              isRead={message.isRead}
            />
          ))
        ) : (
          <ChatPlaceHolder message="No Messages Yet!, Send The First" />
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
                className={`input w-full ${
                  FailToSendMessage && " border-2 border-red-400 "
                } shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-base font-poppins text-base font-normal leading-normal `}
              />

              <button
                onClick={async () => {
                  setInputValue("");

                  if (inputValue.length > 0) {
                    await sendMessageCall(
                      chatState.selectedChatID,
                      inputValue
                    ).then((res) => {
                      if (res?.status !== 200 && res?.status !== 201) {
                        setFail(true);
                        toast.error(
                          "you are not authorized to send messages in this room"
                        );
                        // set the input to red color
                      } else {
                      }
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
