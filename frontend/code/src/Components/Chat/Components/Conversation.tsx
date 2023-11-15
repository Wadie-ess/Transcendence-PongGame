import { forwardRef, useEffect, useRef, useState } from "react";
import { ConversationProps } from "..";
import {
  Message,
  groupIcon,
  chatRooms,
  More,
  Send,
  Options,
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
import { useSocketStore } from "../Services/SocketsServices";
import { useNavigate } from "react-router-dom";
import { blockUserCall } from "../Services/FriendsServices";
import { InvitationWaiting } from "../../Layout/Assets/Invitationacceptance";

import { useInView } from "react-intersection-observer";
import { classNames } from "../../../Utils/helpers";

export interface ChatPaceHolderProps {
  username: string;
  message: string;
  time?: string;
  isMe: boolean;
  isRead: boolean;
  userImage: string;
  id: string;
  secondUserId: string;
  bio?: string;
}

export const CurrentUserMessage = forwardRef<any, Message>((props, ref) => {
  const currentUserId = useUserStore((state) => state.id);

  return props.senderId === currentUserId ? (
    <div ref={ref} className={classNames("chat chat-end p-2 pl-5", props.isPending && 'opacity-50')}>
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {formatTime(props.time)}
        </time>
      </div>
      <div
        className={classNames(
          'max-w-max chat-bubble text-white whitespace-normal break-words text-sm md:text-base w-[60%] inline-block',
          props.isFailed === true ? "bg-red-500" : "bg-purple-500"
        )}
      >
        {props.message}
      </div>
      <div
        className={classNames(
          'chat-footer p-1 font-poppins text-xs font-light leading-normal',
          props.isFailed ? "text-red-500" : "text-gray-400"
        )}
      >
        {props.isPending ? 'Sending...' : (props.isFailed ? "Failed" : "Delivered")}
      </div>
    </div>
  ) : (
    <div ref={ref} className="chat chat-start p-3 pr-5">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {props.avatar?.medium
            ? <img src={props.avatar.medium} alt="" />
            : <div className="w-10 h-10 bg-violet-400 rounded-full" />}
        </div>
      </div>
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {formatTime(props.time)}
        </time>
      </div>
      <div className="max-w-max chat-bubble whitespace-normal text-sm md:text-base break-words w-[60%] inline-block">
        {props.message}
      </div>
    </div>
  );
});

export const ConversationHeader: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const navigate = useNavigate();
  const LayoutState = useModalStore((state) => state);
  const ChatState = useChatStore((state) => state);
  const SelectedChat = useChatStore((state) => state.selectedChatID);
  const toggleChatRooms = useChatStore((state) => state.toggleChatRooms);
  const currentUser = useChatStore((state) => state.currentDmUser);
  const selectedChatType = useChatStore((state) => state.selectedChatType);
  const socketStore = useSocketStore();
  const inviteWaitingModalRef = useRef<HTMLDialogElement>(null);
  const user = useUserStore();

  const currentRoom = chatRooms.find((room) => room.id === SelectedChat);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, SetOnline] = useState(false);

  const handleOnline = (userId: string) => {
    currentUser.secondUserId === userId && SetOnline(true);
    ChatState.addOnlineFriend(userId);
  };

  const handleOffline = (userId: string) => {
    currentUser.secondUserId === userId && SetOnline(false);
    ChatState.removeOnlineFriend(userId);
  };

  const handleConfirmation = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    SetOnline(false);

    socketStore.socket.on("friendOffline", handleOffline);
    socketStore.socket.on("friendOnline", handleOnline);

    return () => {
      socketStore.socket.off("friendOffline", handleOffline);
      socketStore.socket.off("friendOnline", handleOnline);
    };
    // eslint-disable-next-line
  }, [ChatState.selectedChatID]);

  return (
    <>
      <div className="flex flex-row justify-between bg-[#1A1C26] px-4 py-2 border-b-2 border-base-200">
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center h-full mr-4 lg:hidden">
            <button className="w-6 h-10" onClick={() => toggleChatRooms()}>
              <img alt="options" src={Options} />
            </button>
          </div>

          <button className="pr-1"
            onClick={async () => {
              if (ChatState.selectedChatType === ChatType.Chat) {
                navigate(`/profile/${currentUser.secondUserId}`);
              }
            }}
          >
            <img
              className="w-12 rounded-full"
              alt=""
              src={selectedChatType === ChatType.Chat ? currentUser?.avatar.large : groupIcon}
            />
          </button>
          <div className="flex flex-col pl-2 ">
            <p className="text-white font-poppins text-base font-medium leading-normal">
              {selectedChatType === ChatType.Chat
                ? currentUser?.name
                : currentRoom?.isOwner
                  ? currentRoom.name + " ♚"
                  : currentRoom?.name}
            </p>
            {selectedChatType === ChatType.Chat ? (
              <p
                className={`${isOnline ? "text-green-500" : "text-red-500"
                  } font-poppins text-sm font-medium leading-normal`}
              >
                {isOnline ? "online" : "offline"}
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
              className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute right-full"
            >
              <li
                onClick={async () => {
                  ChatState.setIsLoading(true);
                  await blockUserCall(currentUser?.secondUserId).then((res) => {
                    ChatState.setIsLoading(false);
                    if (res?.status === 200 || res?.status === 201) {
                      toast.success("User Blocked");
                      // ChatState.selectNewChatID("1");
                    } else {
                      toast.error("Could Not Block User");
                    }
                  });
                }}
              >
                <span className="hover:bg-[#7940CF]">Block</span>
              </li>
              <li
                className="hover:bg-[#7940CF] hover:rounded"
                onClick={() => {
                  socketStore?.socket?.emit(
                    "inviteToGame",
                    {
                      inviterId: user.id,
                      opponentId: currentUser.secondUserId,
                      gameMode: "classic",
                    },
                    (data: { error: string | null; gameId: string }) => {
                      if (data.error) {
                        toast.error(data.error);
                        return;
                      }
                      user.setGameWaitingId(data.gameId);
                      inviteWaitingModalRef.current?.showModal();
                    }
                  );
                }}
              >
                <span>Invite to a game</span>
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
                  <div className="icons-row flex flex-col">
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
              {/* {currentRoom?.isOwner === false && ( */}
              <div>
                <li
                  onClick={async () => {
                    ChatState.setIsLoading(true);
                    await leaveRoomCall(currentRoom?.id as string).then(
                      (res) => {
                        ChatState.setIsLoading(false);
                        if (res?.status === 200 || res?.status === 201) {
                          toast.success("Room Left Successfully");
                          // ChatState.changeChatType(ChatType.Chat);
                          ChatState.deleteRoom(currentRoom?.id as string);
                        }
                      }
                    );
                  }}
                >
                  <span className="hover:bg-[#7940CF]">leave The Room</span>
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
      <InvitationWaiting
        ref={inviteWaitingModalRef}
        oppenent={{
          picture: currentUser.avatar,
          name: {
            first: currentUser.name,
            last: "",
          },
          username: "",
        }}
        user={user}
      />
    </>
  );
};

export const Conversation: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const chatState = useChatStore();
  const currentUserId = useUserStore((state) => state.id);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const socketStore = useSocketStore();

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight + 1000,
        behavior: "smooth",
      });
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [FailToSendMessage, setFail] = useState(false);
  const [IsLoading, setLoading] = useState(true);
  const currentUser = useUserStore((state) => state);

  const [showLoadMore, setShowLoadMore] = useState(true);

  const handleMessage = (message: APIMessageResponse) => {
    if (message.roomId === chatState.selectedChatID) {
      const newMessage: Message = {
        avatar: message.avatar,
        senderId: message.authorId,
        message: message.content,
        time: message.time,
      };
      if (!message.clientMessageId) {
        chatState.unshiftMessage(newMessage);
      } else {
        chatState.updateTransientMessage(newMessage, message.clientMessageId);
      }
      scrollToBottom();
    }
  };

  const handleLeave = (event: { roomId: string; type: string }) => {
    if (chatState.selectedChatID === event.roomId && event.type === "kick") {
      chatState.deleteRoom(event.roomId);
    }
  };

  const handleInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setFail(false);
    setInputValue(e.target.value);
  };

  const [ref, inView] = useInView({ threshold: 0.5 });

  useEffect(() => {
    setShowLoadMore(true);
    chatState.fillCurrentMessages([]);
    // eslint-disable-next-line
  }, [chatState.selectedChatID]);

  useEffect(() => {
    if (!socketStore.socket) return;

    socketStore.socket.emit("joinRoom", {
      memberId: currentUser.id,
      roomId: chatState.selectedChatID,
    });
    socketStore.socket.emit("PingOnline", {
      friendId: chatState.currentDmUser.secondUserId,
    });

    // const handle
    socketStore.socket.on("roomDeparture", handleLeave);
    socketStore.socket.on("message", handleMessage);

    return () => {
      socketStore.socket.off("message", handleMessage);
      socketStore.socket.emit("roomDeparture", {
        roomId: chatState.selectedChatID,
        memberId: currentUser.id,
        type: "out",
      });
    };
    // eslint-disable-next-line
  }, [socketStore.socket, chatState.selectedChatID]);

  useEffect(() => {
    if (chatState.selectedChatID === "1") return;

    setLoading(true);

    const currentMessages = chatState.currentMessages || [];
    const offset = currentMessages.length;

    getRoomMessagesCall(chatState.selectedChatID, offset, 10)
      .then((res) => {
        if (res?.status === 200) {
          if (!res.data || !res.data.length) {
            setShowLoadMore(false);
          } else {
            const messages: Message[] = res.data.map((message: APIMessageResponse) => ({
              id: message.id,
              avatar: message.avatar,
              senderId: message.authorId,
              message: message.content,
              time: message.time,
            }));
            chatState.fillCurrentMessages([...currentMessages, ...messages]);
          }
        }
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line
  }, [chatState.selectedChatID, inView]);

  const sendMessage = async () => {
    if (inputValue.length === 0) return;
    setInputValue("");
    const clientMessageId = btoa(Math.random().toString(36)).substring(0, 16);

    const newMessage: Message = {
      avatar: { thumbnail: '', medium: '', large: '' },
      senderId: currentUserId,
      message: inputValue,
      time: new Date().toISOString(),
      isPending: true,
      clientMessageId,
    };
    chatState.fillCurrentMessages([newMessage, ...chatState.currentMessages]);

    scrollToBottom();

    sendMessageCall(chatState.selectedChatID, inputValue, clientMessageId).then((res) => {
      if (res?.status !== 200 && res?.status !== 201) {
        setFail(true);
        chatState.selectedChatType === ChatType.Room
          ? toast.error("you are not authorized to send messages in this room")
          : toast.error("you are blocked from sending messages to this user");
        chatState.setMessageAsFailed(res?.data.id);
        // Remove failed message
        chatState.removeMessageFromCurrentMessages((e) => e.clientMessageId !== clientMessageId);
      }
    });
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await sendMessage().then(() => scrollToBottom());
    }
  };

  return (
    <div className="flex flex-col h-[99%] ">
      <ConversationHeader onRemoveUserPreview={onRemoveUserPreview} />
      <div
        className="flex-grow overflow-auto no-scrollbar relative flex flex-col-reverse flex-shrink basis-0"
        style={{ overflowAnchor: 'none' }}
        ref={messageContainerRef}
      >
        {(chatState.currentMessages && chatState.currentMessages.length > 0) ? (
          chatState.currentMessages.map((message) => (
            <CurrentUserMessage
              key={message.id || Math.random().toString(36)}
              isFailed={message.isFailed}
              avatar={message.avatar}
              message={message.message}
              time={message.time}
              senderId={message.senderId}
              isRead={message.isRead}
              isPending={message.isPending || false}
            />
          ))
        ) : (
          <ChatPlaceHolder message="No Messages Yet!, Send The First" />
        )}
        {showLoadMore && chatState.currentMessages && chatState.currentMessages.length && <div ref={ref} className="w-full flex items-center justify-center p-2">
          {IsLoading ? 'Loading...' : 'Load more'}
        </div>}
        {IsLoading && (!chatState.currentMessages || !chatState.currentMessages.length) && (
          <div className="text-center justify-center flex flex-col items-center w-full h-full absolute inset-0 bg-gray-900">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>

      <div className="bottom-2">
        <div className="">
          <div className="flex flex-row  m-5 justify-evenly ">
            <div className="flex flex-row w-full justify-center ">
              <input
                value={inputValue}
                onKeyDown={handleKeyPress}
                onChange={handleInputChange}
                type="text"
                placeholder="Type Message "
                className={`input w-full ${FailToSendMessage && " border-2 border-red-400 "
                  } shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-base font-poppins text-base font-normal leading-normal `}
              />

              <button
                onClick={async () => {
                  await sendMessage().then(() => scrollToBottom());
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

type APIMessageResponse = {
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
  clientMessageId?: string;
};
