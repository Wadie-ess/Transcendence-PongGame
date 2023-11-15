import { SetStateAction, useCallback, useEffect, useState } from "react";
import { ChatType, useChatStore } from "../Controllers/RoomChatControllers";
import {
  ChatGif,
  ChatRoom,
  GroupChat,
  InitChat,
  Lock,
  More,
  NullImage,
  RoomMember,
  RoomType,
  Unlock,
  chatRooms,
  groupIcon,
} from "./tools/Assets";

import {
  DeleteRoomCall,
  createNewRoomCall,
  fetchRoomsCall,
  getFriendsCall,
  getRoomMembersCall,
  joinRoomCall,
  takeActionCall,
  updateRoomCall,
} from "../Services/ChatServices";
import toast from "react-hot-toast";
import { Logo } from "../../Layout/Assets/Logo";
import { useModalStore } from "../Controllers/LayoutControllers";
import { useUserStore } from "../../../Stores/stores";
import { formatTime } from "./tools/utils";
import { getBlockedCall, unblockCall } from "../Services/FriendsServices";
import { useSocketStore } from "../Services/SocketsServices";
import { useInView } from "react-intersection-observer";

interface NullComponentProps {
  message: string;
}

export const RoomChatPlaceHolder = () => {
  const ChatRoomsState = useChatStore((state) => state);
  const selectNewChat = useChatStore((state) => state.selectNewChatID);
  const [isLoading, setIsLoading] = useState(false);

  const [ref, inView] = useInView();
  const [EndOfFetching, setEndOfFetching] = useState(false);
  const fetchRooms = useCallback(async () => {
    const offset = ChatRoomsState.recentRooms.length;
    offset === 0 && setIsLoading(true);

    await fetchRoomsCall(offset, 7, true).then((res) => {
      if (res?.status !== 200 && res?.status !== 201) {
      } else {
        const rooms: ChatRoom[] = [];
        res.data.forEach(
          (room: {
            countMembers: number;
            id: string;
            is_admin: boolean;
            is_owner: boolean;
            last_message: {
              content: string;
              createdAt: string;
            };
            name: string;
            type: string;
          }) => {
            rooms.push({
              id: room.id,
              name: room.name,
              type: RoomType[room.type as keyof typeof RoomType],
              messages: [],
              usersId: [],
              isOwner: room.is_owner,
              isAdmin: room.is_admin,
              membersCount: room.countMembers,
              last_message: room.last_message,
            });
          }
        );
        setIsLoading(false);
        if (res.data.length > 0) {
          ChatRoomsState.fillRecentRooms([
            ...ChatRoomsState.recentRooms,
            ...rooms,
          ]);
        } else {
          setEndOfFetching(true);
        }
      }
    });
  }, [
    ChatRoomsState.recentRooms,
    setIsLoading,
    fetchRoomsCall,
    ChatRoomsState.fillRecentRooms,
    setEndOfFetching,
  ]);

  useEffect(() => {
    fetchRooms();
    return () => {
      setEndOfFetching(false);
      ChatRoomsState.fillRecentRooms([]);
    };
  }, [ChatRoomsState.selectedChatType, ChatRoomsState.recentRoomsOnchange]);

  useEffect(() => {
    if (inView && !EndOfFetching) {
      fetchRooms();
    }

    // eslint-disable-next-line
  }, [inView]);

  return ChatRoomsState.recentRooms.length > 0 ? (
    <div className="bg-[#1A1C26] h-full">
      {ChatRoomsState.recentRooms.map((room) => (
        <div
          key={room.id}
          onClick={() => selectNewChat(room.id)}
          className={`message-container flex   px-4 py-5  hover:bg-[#272932] items-center  ${
            ChatRoomsState.selectedChatID === room.id
              ? "bg-[#272932]"
              : "bg-[#1A1C26]"
          }
              
                `}
        >
          <div className="user-image flex-shrink-0 mr-2">
            <img
              className="user-image h-10 w-10 rounded-full"
              src={groupIcon}
              alt={`second's Profile`}
            />
          </div>
          <div className="message-colum align-middle flex flex-col flex-grow">
            <div className="message-row flex flex-row justify-between">
              <div className="flex flex-col">
                <p className="text-white font-poppins text-sm md:text-base font-normal leading-normal   ">
                  {room?.name}
                </p>
                <p className="text-gray-400 font-poppins text-sm font-light leading-normal"></p>
              </div>
              <p className="text-gray-400 font-poppins text-sm font-light leading-normal hidden md:block ">
                {room?.membersCount} Members
              </p>
            </div>
            <div className=" flex flex-row justify-between pt-1 text-base">
              <p className="text-gray-400 font-poppins text-sm font-medium leading-normal max-w-[80px] md:max-w-[180px]  truncate hidden md:block ">
                {room.last_message?.content ?? "No Messages*"}
              </p>
              {room.last_message !== null && (
                <div className="">
                  <p className="text-gray-400 font-poppins text-xs font-light leading-normal">
                    {formatTime(room.last_message?.createdAt ?? "")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <div
        ref={ref}
        className="flex justify-center items-center h-2 py-5 
								"
      >
        <span className="text-xs font-light font-poppins text-gray-400">
          {EndOfFetching ? "No more Rooms" : "Loading..."}
        </span>
      </div>
    </div>
  ) : (
    <div className="p-3 text-center bg-[#1A1C26] h-full">
      {isLoading === true ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <NullPlaceHolder message="You have No Rooms Yet!, Create One" />
      )}
    </div>
  );
};

export const CreateNewRoomModal = () => {
  const [RoomName, setName] = useState("");
  const [RoomPassword, setPassword] = useState("");

  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setPassword(event.target.value);
  };
  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setName(event.target.value);
  };

  const createNewRoom = useChatStore((state) => state.createNewRoom);
  const [selectedOption, setSelectedOption] = useState(RoomType.public);
  const setIsLoading = useChatStore((state) => state.setIsLoading);
  const chatState = useChatStore((state) => state);

  const resetModalState = () => {
    setPassword("");
    setName("");
    setSelectedOption(RoomType.public);
  };
  return (
    <div className="modal w-screen " id="my_modal_8">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar  w-[85%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal">
              Create Chat Room
            </p>
          </div>
          <div className="flex flex-row p-3">
            <div className="flex flex-row w-full justify-center pt-2">
              <img className="mr-2" alt="" src={GroupChat} />
              <input
                value={RoomName}
                onChange={handleChange}
                type="text"
                placeholder="Set The Room Name"
                className="input w-full shadow-xl max-w-lg bg-[#272932] placeholder:text-gray-400 font-poppins text-base font-normal leading-normal"
              />
            </div>
          </div>

          <div className="flex flex-row form-control justify-around">
            <label className="label cursor-pointer ">
              <span className="label-text pr-2">Public</span>
              <input
                type="radio"
                name="radio-10"
                value="Public"
                className="radio checked:bg-purple-500"
                checked={selectedOption === RoomType.public}
                onChange={() => setSelectedOption(RoomType.public)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text pr-2">Private</span>
              <input
                type="radio"
                name="radio-10"
                value="Private"
                className="radio checked:bg-red-500"
                checked={selectedOption === RoomType.private}
                onChange={() => setSelectedOption(RoomType.private)}
              />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text pr-2">Protected</span>
              <input
                type="radio"
                name="radio-10"
                value="Protected"
                className="radio checked:bg-orange-500"
                checked={selectedOption === RoomType.protected}
                onChange={() => setSelectedOption(RoomType.protected)}
              />
            </label>
          </div>

          {selectedOption === RoomType.protected && (
            <div className="flex flex-row p-3">
              <div className="flex flex-row w-full justify-center pt-2">
                <p>Group Password</p>
                <input
                  value={RoomPassword}
                  onChange={handlePasswordChange}
                  type="Password"
                  className="input w-full shadow-xl max-w-lg bg-[#272932] placeholder:text-gray-400 font-poppins text-base font-normal leading-normal"
                />
              </div>
            </div>
          )}
          {/*  */}

          <div className="modal-action ">
            <a
              href="#/"
              onClick={resetModalState}
              className="btn hover:bg-purple-500"
            >
              {"Close "}
            </a>
            <a
              href="#/"
              onClick={async () => {
                if (
                  RoomName !== "" &&
                  RoomName.length > 3 &&
                  RoomName.length < 20
                ) {
                  if (
                    RoomPassword.length < 8 &&
                    selectedOption === RoomType.protected
                  ) {
                    console.log(selectedOption);
                    toast.error("password must be at least 8 characters");
                    resetModalState();
                    return;
                  }
                  setIsLoading(true);
                  await createNewRoomCall(
                    RoomName,
                    RoomType[selectedOption],
                    selectedOption === RoomType.protected
                      ? RoomPassword
                      : undefined
                  ).then((res) => {
                    if (res?.status !== 200 && res?.status !== 201) {
                      toast.error("something went wrong, try again");
                      resetModalState();
                    } else {
                      toast.success("Room Created Successfully");
                      // createNewRoom(RoomName, selectedOption, res.data.id);

                      chatState.changeChatType(ChatType.Room);
                      chatState.setOnRoomsChange(
                        !chatState.recentRoomsOnchange
                      );
                      // chatState.fillRecentRooms([
                      resetModalState();
                    }
                    setIsLoading(false);
                  });
                } else {
                  toast.error(
                    "Room name must be at least 4 characters and less than 20 "
                  );
                  resetModalState();
                }
              }}
              className="btn hover:bg-purple-500"
            >
              {"Create "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FriendTile = (props: { user: RoomMember }) => {
  const [IsAdding, setIsAdding] = useState(false);
  const selectedChatID = useChatStore((state) => state.selectedChatID);
  const LayoutState = useModalStore((state) => state);
  const user = props.user;

  return (
    <div key={user.id}>
      <div className="flex flex-row justify-between p-3">
        <div className="flex flex-row items-center space-x-3">
          <div className="pr-1">
            <img
              className="w-12 rounded-full "
              alt=""
              src={user?.avatar?.medium}
            />
          </div>

          <p className="text-white font-poppins text-base font-medium leading-normal">
            {user?.firstname ?? "user"}
          </p>
        </div>

        <div>
          <button
            onClick={async () => {
              setIsAdding(true);
              await takeActionCall(selectedChatID, user.id, "add").then(
                (res) => {
                  setIsAdding(false);
                  if (res?.status === 200 || res?.status === 201) {
                    LayoutState.setShowAddUsersModal(
                      !LayoutState.showAddUsersModal
                    );
                    toast.success("User Added Successfully");
                  }
                }
              );
            }}
            className="btn  swap swap-rotate bg-purple-500 p-3 rounded-xl text-white hover:bg-blue-400"
          >
            <p className="swap-off fill-current">
              {IsAdding === true ? "ADDING..." : "ADD"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export const BlockedFriendTile = (props: { user: RoomMember }) => {
  const [IsAdding, setIsAdding] = useState(false);
  const LayoutState = useModalStore((state) => state);
  const user = props.user;

  return (
    <div key={user.id}>
      <div className="flex flex-row justify-between p-3">
        <div className="flex flex-row items-center space-x-3">
          <div className="pr-1">
            <img
              className="w-12 rounded-full "
              alt=""
              src={user?.avatar?.medium}
            />
          </div>

          <p className="text-white font-poppins text-base font-medium leading-normal">
            {user?.firstname ?? "user"}
          </p>
        </div>

        <div>
          <button
            onClick={async () => {
              setIsAdding(true);
              await unblockCall(user.id).then((res) => {
                setIsAdding(false);
                if (res?.status === 200 || res?.status === 201) {
                  LayoutState.setShowBlockedList(
                    !LayoutState.showBlockedLIstModal
                  );
                  toast.success("User Unblocked Successfully");
                }
              });
            }}
            className="btn  swap swap-rotate bg-purple-500 p-3 rounded-xl text-white hover:bg-blue-400"
          >
            <p className="swap-off fill-current">
              {IsAdding === true ? "UNBLOCKING..." : "UNBLOCK"}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export const BlockedUsersModal = () => {
  const [currentFriends, setUsers] = useState<RoomMember[]>([]);
  const LayoutState = useModalStore((state) => state);
  const [IsLoading, setIsLoading] = useState(false);

  const [skipCount, setSkipCount] = useState(true);

  useEffect(() => {
    if (skipCount) setSkipCount(false);
    if (!skipCount) {
      const fetchData = async () => {
        try {
          setIsLoading(true);

          await getBlockedCall(0, 20).then((res) => {
            setIsLoading(false);
            if (res?.status === 200 || res?.status === 201) {
              const friends: RoomMember[] = [];
              res.data.forEach(
                (friend: {
                  userId: string;
                  firstname: string;
                  lastname: string;
                  avatar?: {
                    thumbnail: string;
                    medium: string;
                    large: string;
                  };
                }) => {
                  friends.push({
                    id: friend.userId,
                    firstname: friend.firstname,
                    lastname: friend.lastname,
                    // to inject it with the real images later
                    avatar: friend.avatar,
                  } as RoomMember);
                }
              );

              setUsers(friends);
            } else {
            }
          });
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };

      fetchData();
    }
    // eslint-disable-next-line
  }, [LayoutState.showBlockedLIstModal]);
  return (
    <div className="modal w-screen " id="my_modal_3">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar  w-[85%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal pb-2">
              Blocked Friends List
            </p>
          </div>

          {IsLoading === true ? (
            <div className="text-center p-2">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              {currentFriends.length < 1 && (
                <NullPlaceHolder message="No Blocked Users  Yet" />
              )}
              {currentFriends.map((user) => (
                <BlockedFriendTile key={user.id} user={user} />
              ))}
            </div>
          )}

          <div className="modal-action ">
            <a href="#/" className="btn hover:bg-purple-500">
              {"Close "}
            </a>
            <a href="#/" className="btn hover:bg-purple-500">
              {"Done "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddUsersModal = () => {
  const [currentFriends, setUsers] = useState<RoomMember[]>([]);
  const [currentRoomMembers, setRoomMembers] = useState<RoomMember[]>([]);
  const LayoutState = useModalStore((state) => state);
  const [IsLoading, setIsLoading] = useState(false);

  const [skipCount, setSkipCount] = useState(true);
  const ChatState = useChatStore((state) => state);

  const [ref, inView] = useInView();
  const [EndOfFetching, setEndOfFetching] = useState(false);

  useEffect(() => {
    if (skipCount) setSkipCount(false);
    if (!skipCount) {
      const fetchData = async () => {
        const offset = currentFriends.length;

        try {
          setIsLoading(true);

          await getRoomMembersCall(
            ChatState.selectedChatID as string,
            0,
            20
          ).then((res) => {
            setIsLoading(false);
            if (res?.status === 200 || res?.status === 201) {
              const extractedData = res.data;
              setRoomMembers(extractedData);
            } else {
              console.log("wrong");
            }
          });

          await getFriendsCall(0, 20).then((res) => {
            setIsLoading(false);
            if (res?.status === 200 || res?.status === 201) {
              const friends: RoomMember[] = [];
              res.data.forEach(
                (friend: {
                  userId: string;
                  firstname: string;
                  lastname: string;
                  avatar: {
                    thumbnail: string;
                    medium: string;
                    large: string;
                  };
                }) => {
                  friends.push({
                    id: friend.userId,
                    firstname: friend.firstname,
                    lastname: friend.lastname,
                    // to inject it with the real images later
                    avatar: friend.avatar,
                  } as RoomMember);
                }
              );

              setUsers(friends);
            } else {
            }
          });
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      if (!EndOfFetching) {
        fetchData();
      }
    }
    // eslint-disable-next-line
  }, [LayoutState.showAddUsersModal]);
  return (
    <div className="modal w-screen " id="my_modal_6">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar  w-[85%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal pb-2">
              Add Friends To The Room
            </p>
          </div>

          {IsLoading === true ? (
            <div className="text-center p-2">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="max-h-[300px] overflow-y-auto no-scrollbar">
              {currentFriends.filter(
                (friend) =>
                  !currentRoomMembers.some((member) => member.id === friend.id)
              ).length < 1 && (
                <NullPlaceHolder message="No Friends To Add Yet" />
              )}
              {currentFriends
                .filter(
                  (friend) =>
                    !currentRoomMembers.some(
                      (member) => member.id === friend.id
                    )
                )
                .map((user) => (
                  <FriendTile key={user.id} user={user} />
                ))}
            </div>
          )}

          <div className="modal-action ">
            <a href="#/" className="btn hover:bg-purple-500">
              {"Close "}
            </a>
            <a href="#/" className="btn hover:bg-purple-500">
              {"Done "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RoomSettingsModal = () => {
  const currentUser = useUserStore((state) => state);
  const editRoom = useChatStore((state) => state.editRoom);
  const selectedChatID = useChatStore((state) => state.selectedChatID);
  const deleteRoom = useChatStore((state) => state.deleteRoom);
  const currentRoom = chatRooms.find((room) => room.id === selectedChatID);
  const LayoutState = useModalStore((state) => state);
  const setIsLoading = useChatStore((state) => state.setIsLoading);
  const socketStore = useSocketStore();
  const chatState = useChatStore((state) => state);

  const [currentUsers, setUsers] = useState<RoomMember[]>([]);
  const [skipCount, setSkipCount] = useState(true);
  const [TakingAction, setTakeAction] = useState(false);
  const [RoomName, setName] = useState("");
  const [RoomPassword, setPassword] = useState("");
  const [LoadingUsers, setLOading] = useState(false);
  const [IsUpdated, setUpdate] = useState(false);

  const handlePasswordChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUpdate(true);
    setPassword(event.target.value);
  };
  const handleChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setUpdate(true);
    setName(event.target.value || "");
  };
  const [selectedOption, setSelectedOption] = useState(RoomType.public);

  useEffect(() => {
    setSelectedOption(currentRoom?.type as RoomType);
    setName((currentRoom?.name || "") as string);
    if (skipCount) setSkipCount(false);
    if (!skipCount) {
      const fetchData = async () => {
        try {
          setLOading(true);
          await getRoomMembersCall(currentRoom?.id as string, 0, 20).then(
            (res) => {
              console.log("hna");
              setLOading(false);
              if (res?.status === 200 || res?.status === 201) {
                const extractedData = res.data;

                setUsers(extractedData);
              }
            }
          );
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
      if (chatState.selectedChatID !== "1") {
        fetchData();
      }
    }
    // eslint-disable-next-line
  }, [LayoutState.showSettingsModal]);

  const resetModalState = () => {
    setUpdate(false);
    setPassword("");
    setSelectedOption(currentRoom?.type as RoomType);
    setName((currentRoom?.name || "") as string);
    setUsers([]);
  };

  return (
    <div className="modal w-screen " id="my_modal_9">
      <div className="modal-box bg-[#1A1C26] relative no-scrollbar w-[90%] md:w-[50%] ">
        <div className="flex flex-col">
          {TakingAction === true ? (
            <div className="text-center p-2">
              <span className="loading loading-infinity loading-lg bg-purple-500"></span>
              <p>Processing...</p>
            </div>
          ) : (
            <div>
              <div className="flex flex-row justify-center">
                <p className="text-purple-500 font-poppins text-lg font-medium leading-normal">
                  {RoomName}'s Settings
                </p>
              </div>
              <div className="flex flex-row p-3">
                <div className="flex flex-row w-full justify-center pt-2">
                  <img className="mr-2" alt="" src={GroupChat} />
                  <input
                    value={RoomName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Set The Room Name"
                    className="input w-full shadow-xl max-w-lg bg-[#272932] placeholder:text-gray-400 font-poppins text-base font-normal leading-normal"
                  />
                </div>
              </div>
              <div className="flex flex-row form-control justify-around">
                <label className="label cursor-pointer ">
                  <span className="label-text pr-2">Public</span>
                  <input
                    type="radio"
                    name="radio-20"
                    value="Public"
                    className="radio checked:bg-purple-500"
                    checked={selectedOption === RoomType.public}
                    onChange={() => {
                      setUpdate(true);
                      setSelectedOption(RoomType.public);
                    }}
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text pr-2">Private</span>
                  <input
                    type="radio"
                    name="radio-20"
                    value="Private"
                    className="radio checked:bg-red-500"
                    checked={selectedOption === RoomType.private}
                    onChange={() => {
                      setUpdate(true);
                      setSelectedOption(RoomType.private);
                    }}
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text pr-2">Protected</span>
                  <input
                    type="radio"
                    name="radio-20"
                    value="Protected"
                    className="radio checked:bg-orange-500"
                    checked={selectedOption === RoomType.protected}
                    onChange={() => {
                      setUpdate(true);
                      setSelectedOption(RoomType.protected);
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {selectedOption === RoomType.protected && (
            <div className="flex flex-row p-3">
              <div className="flex flex-row w-full justify-center pt-2">
                <p> new Password</p>
                <input
                  value={RoomPassword}
                  onChange={handlePasswordChange}
                  type="Password"
                  className="input w-full shadow-xl max-w-lg bg-[#272932] placeholder:text-gray-400 font-poppins text-base font-normal leading-normal"
                />
              </div>
            </div>
          )}
          <p className="p-2">Room Members</p>

          {LoadingUsers === true ? (
            <div className="text-center p-2">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="max-h-[300px]  overflow-y-auto no-scrollbar justify-center ">
              {currentUsers.length < 2 && (
                <NullPlaceHolder message="You have No Members, Add someone!" />
              )}
              <div className="">
                {currentUsers
                  .filter((user) => user.id !== currentUser.id)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-row justify-between  bg-[#1A1C26] p-3 border-gray-600 "
                    >
                      <div className="flex flex-row items-center space-x-3">
                        <div className="pr-1">
                          <img
                            className="w-12 rounded-full "
                            alt=""
                            src={user.avatar.medium}
                          />
                        </div>

                        <p className="text-white font-poppins text-base font-medium leading-normal">
                          {user?.firstname ?? "user"}
                        </p>
                      </div>

                      <div
                        className="dropdown top-0 z-100"
                        style={{ position: "initial" }}
                      >
                        <label tabIndex={0} className="">
                          <summary className="list-none p-3 cursor-pointer ">
                            <img src={More} alt="More" />
                          </summary>
                        </label>
                        <ul
                          tabIndex={0}
                          className="p-2  z-101 absolute right-5 bottom-44 shadow menu dropdown-content bg-base-100 rounded-box w-40"
                        >
                          <li
                            onClick={async () => {
                              if (user.isBaned) {
                                socketStore.socket.emit("unban", {
                                  roomId: chatState.selectedChatID,
                                  memberId: user.id,
                                });
                              } else {
                                socketStore.socket.emit("roomDeparture", {
                                  roomId: chatState.selectedChatID,
                                  memberId: user.id,
                                });
                              }

                              setTakeAction(true);
                              await takeActionCall(
                                selectedChatID as string,
                                user.id,
                                user.isBaned ? "unban" : "ban"
                              ).then((res) => {
                                setTakeAction(false);
                                if (
                                  res?.status === 200 ||
                                  res?.status === 201
                                ) {
                                  toast.success(res.data.message);
                                }
                                LayoutState.setShowSettingsModal(
                                  !LayoutState.showSettingsModal
                                );
                              });
                            }}
                          >
                            <span className="hover:bg-[#7940CF]">
                              {user.isBaned ? "UnBan" : "Ban"}
                            </span>
                          </li>

                          {user.isMuted === false && (
                            <li
                              onClick={async () => {
                                setTakeAction(true);
                                await takeActionCall(
                                  selectedChatID as string,
                                  user.id,
                                  "mute"
                                ).then((res) => {
                                  setTakeAction(false);
                                  if (
                                    res?.status === 200 ||
                                    res?.status === 201
                                  ) {
                                    toast.success(
                                      "User Muted For a 5 minutes Successfully"
                                    );
                                  }
                                  LayoutState.setShowSettingsModal(
                                    !LayoutState.showSettingsModal
                                  );
                                });
                              }}
                            >
                              <span className="hover:bg-[#7940CF]">mute</span>
                            </li>
                          )}

                          <li
                            onClick={async () => {
                              setTakeAction(true);
                              await takeActionCall(
                                selectedChatID as string,
                                user.id,
                                "kick"
                              ).then((res) => {
                                setTakeAction(false);
                                LayoutState.setShowSettingsModal(
                                  !LayoutState.showSettingsModal
                                );

                                if (
                                  res?.status === 200 ||
                                  res?.status === 201
                                ) {
                                  toast.success("User Kicked Successfully");
                                  socketStore.socket.emit("roomDeparture", {
                                    roomId: chatState.selectedChatID,
                                    memberId: user.id,
                                    type: "kick",
                                  });
                                }
                              });
                            }}
                          >
                            <span className="hover:bg-[#7940CF]">kick</span>
                          </li>
                          <li
                            onClick={async () => {
                              setTakeAction(true);
                              await takeActionCall(
                                selectedChatID as string,
                                user.id,
                                "setAdmin"
                              ).then((res) => {
                                setTakeAction(false);
                                if (
                                  res?.status === 200 ||
                                  res?.status === 201
                                ) {
                                  toast.success(
                                    "User have been set as Admin Successfully"
                                  );
                                }
                              });
                            }}
                          >
                            <span className="hover:bg-[#7940CF]">
                              Set as admin
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="flex fex row justify-between items-baseline">
            <div className="">
              {currentRoom?.isOwner && (
                <a
                  href="#/"
                  onClick={async () => {
                    setIsLoading(true);
                    await DeleteRoomCall(selectedChatID as string).then(
                      (res) => {
                        setIsLoading(false);
                        if (res?.status === 200 || res?.status === 201) {
                          deleteRoom(selectedChatID as string);
                          toast.success("Room Deleted Successfully");
                          resetModalState();
                        }
                      }
                    );
                  }}
                  className="btn hover:bg-red-500  "
                >
                  {"Delete Room "}
                </a>
              )}
            </div>
            <div className="modal-action">
              <a
                href="#/"
                onClick={resetModalState}
                className="btn hover:bg-purple-500"
              >
                {"Close "}
              </a>
              {IsUpdated === true && (
                <a
                  href="#/"
                  onClick={async () => {
                    console.log(RoomType[selectedOption]);
                    if (RoomName !== "" && RoomName.length > 3) {
                      setIsLoading(true);
                      await updateRoomCall(
                        RoomName,
                        RoomType[selectedOption],
                        currentRoom?.id!,
                        selectedOption === RoomType.protected
                          ? RoomPassword
                          : undefined
                      ).then((res) => {
                        if (res?.status !== 200 && res?.status !== 201) {
                          resetModalState();
                        } else {
                          toast.success("Room Updated Successfully");
                          editRoom(RoomName, selectedOption, currentRoom?.id!);
                          resetModalState();
                        }
                        setIsLoading(false);
                      });
                    } else {
                      toast.error("Room name must be at least 4 characters");
                      resetModalState();
                    }
                  }}
                  className="btn hover:bg-purple-500"
                >
                  {"Save "}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExploreRoomsModal = () => {
  const [RoomPassword, setPassword] = useState("");
  const [ChatRooms, SetChatRooms] = useState(chatRooms);
  const [selectedOption, setSelectedOption] = useState(RoomType.public);
  const [SelectedRoomID, setSelectedRoomID] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const recentRooms = useChatStore((state) => state);

  const modalState = useModalStore((state) => state);
  const resetModalState = () => {
    setPassword("");
    setSelectedOption(RoomType.public);
    setSelectedRoomID("0");
    setEndOfFetching(false);
    SetChatRooms([]);
  };

  const [ref, inView] = useInView();
  const [EndOfFetching, setEndOfFetching] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      if (!EndOfFetching) {
        const offset = ChatRooms.length;
        offset === 0 && setIsLoading(true);
        await fetchRoomsCall(offset, 5, false).then((res) => {
          if (res?.status !== 200 && res?.status !== 201) {
            resetModalState();
          } else {
            const rooms: ChatRoom[] = [];
            res.data.forEach(
              (room: {
                id: string;
                is_admin: boolean;
                is_owner: boolean;
                name: string;
                type: string;
              }) => {
                {
                  rooms.push({
                    id: room.id,
                    name: room.name,
                    type: RoomType[room.type as keyof typeof RoomType],
                    messages: [],
                    usersId: [],
                    isOwner: room.is_owner,
                    isAdmin: room.is_admin,
                  });
                }
              }
            );
            setIsLoading(false);
            if (res.data.length > 0) {
              SetChatRooms([...ChatRooms, ...rooms]);
            } else {
              setEndOfFetching(true);
            }
          }
        });
      }
    };

    if (!EndOfFetching) {
      fetch();
    }

    // eslint-disable-next-line
  }, [modalState, inView]);

  return (
    <div className="modal w-screen " id="my_modal_5">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar  w-[85%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal m-2">
              Explore and Join Rooms
            </p>
          </div>
          {isLoading === true ? (
            <div className="text-center p-2">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto no-scrollbar">
              {ChatRooms.length > 0 ? (
                <>
                  {ChatRooms.filter(
                    (room) =>
                      recentRooms.recentRooms.find(
                        (recentRoom) => recentRoom.id === room.id
                      ) === undefined
                  ).map((room) => (
                    <div
                      key={room.id}
                      className={
                        "flex flex-col  bg-[#272932] p-4 rounded-md m-2   " +
                        (SelectedRoomID === room.id
                          ? "border-2 border-purple-500"
                          : "")
                      }
                      onClick={() => {
                        setSelectedOption(room.type);
                        setSelectedRoomID(room.id);
                      }}
                    >
                      <div className="flex flex-row  justify-between items-center">
                        <a href="/#">
                          <img className="w-[100%]" alt="" src={groupIcon} />
                        </a>
                        <p>{room.name}</p>

                        <a href="/#">
                          <img
                            className=""
                            alt=""
                            src={
                              room.type === RoomType.protected ? Lock : Unlock
                            }
                          />
                        </a>
                      </div>
                    </div>
                  ))}
                  <div
                    ref={ref}
                    className="flex justify-center items-center h-2 py-2
								"
                  >
                    <span className="text-xs font-light font-poppins text-gray-400">
                      {EndOfFetching ? "No more Rooms" : "Loading..."}
                    </span>
                  </div>
                </>
              ) : (
                <NullPlaceHolder message="No Rooms For You Yet!" />
              )}
            </div>
          )}
        </div>
        {selectedOption === RoomType.protected && (
          <div className="flex flex-row p-3">
            <div className="flex flex-row w-full justify-center pt-2">
              <p>Room Password</p>
              <input
                value={RoomPassword}
                onChange={(event) => setPassword(event.target.value)}
                type="Password"
                className="input w-full shadow-xl max-w-lg bg-[#272932] placeholder:text-gray-400 font-poppins text-base font-normal leading-normal"
              />
            </div>
          </div>
        )}
        <div className="modal-action">
          <a
            href="#/"
            onClick={resetModalState}
            className="btn hover:bg-purple-500"
          >
            {"Close "}
          </a>
          {ChatRooms.length > 0 && SelectedRoomID !== "0" && (
            <a
              href="#/"
              onClick={async () => {
                recentRooms.setIsLoading(true);

                await joinRoomCall(
                  SelectedRoomID,
                  selectedOption === RoomType.protected
                    ? RoomPassword
                    : undefined
                ).then((res) => {
                  recentRooms.setIsLoading(false);
                  if (res?.status !== 200 && res?.status !== 201) {
                    resetModalState();
                  } else {
                    toast.success("Room Joined Successfully");
                    // recentRooms.selectNewChatID("1");
                    recentRooms.setOnRoomsChange(
                      !recentRooms.recentRoomsOnchange
                    );
                    recentRooms.changeChatType(ChatType.Room);

                    resetModalState();
                  }
                });
              }}
              className="btn hover:bg-purple-500"
            >
              {"Join"}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
}) => {
  const closeModal = () => {
    // Close the modal by setting isOpen to false
    onConfirm();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-box bg-[#1A1C26] rounded-lg shadow-white  p-5 absolute">
            <h3 className="text-lg font-semibold">Confirmation</h3>
            <p>Are you sure you want to proceed?</p>
            <div className="mt-4 flex justify-center">
              <button className="btn mr-2" onClick={closeModal}>
                No
              </button>
              <button className="btn btn-primary bg-white" onClick={closeModal}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const NullPlaceHolder: React.FC<NullComponentProps> = ({ message }) => {
  return (
    <div className="null image flex flex-col justify-center items-center h-full">
      <img
        alt="null"
        className="w-[35%] bottom-2 max-w-xs"
        src={NullImage}
      ></img>
      <p className="text-gray-500 font-montserrat text-18 font-semibold leading-28 p-3">
        {message}
      </p>
    </div>
  );
};

export const ChatPlaceHolder: React.FC<NullComponentProps> = ({ message }) => {
  return (
    <div className="null image flex flex-col justify-center items-center h-full">
      <img
        alt="null"
        className="w-[35%] bottom-2 opacity-40 max-w-xs"
        src={ChatGif}
      ></img>
      <p className="text-gray-500 font-montserrat text-18 font-semibold leading-28 p-3">
        {message}
      </p>
    </div>
  );
};

export const InitChatPlaceholder = () => {
  return (
    <div className="null image flex flex-col justify-center items-center h-full">
      <img
        alt="null"
        className="w-[30%] bottom-2 opacity-30 max-w-xs"
        src={InitChat}
      ></img>
      {/* <p className="text-gray-300 font-montserrat text-18 font-bold leading-28 p-1">
          Your Messages
      </p> */}
      <p className="text-gray-500 font-montserrat text-18 font-semibold leading-28 p-3">
        Send private and Public messages to a friends or groups
      </p>
    </div>
  );
};

export const ShowLogoModal = () => {
  const isLoading = useChatStore((state) => state.isLoading);
  return isLoading === true ? (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]  `}
    >
      <div className="modal-box bg-[#2d2f3b] rounded-lg shadow-white  p-5 border-2 border-purple-500 text-center">
        <div>
          <div className="pl-48 p-4">
            <Logo />
          </div>

          <p>Loading...</p>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
