import { SetStateAction, useEffect, useState } from "react";
import { useChatStore } from "../Controllers/ChatControllers";
import users, {
  ChatGif,
  ChatRoom,
  GroupChat,
  Lock,
  More,
  NullImage,
  RoomType,
  Unlock,
  chatRooms,
  check,
  groupIcon,
} from "./tools/Assets";
import { SelectedUserTile } from "..";

import {
  createNewRoomCall,
  fetchRoomsCall,
  updateRoomCall,
} from "../Services/ChatServices";
import toast from "react-hot-toast";
import { Logo } from "../../Layout/Assets/Logo";
import { useModalStore } from "../Controllers/ModalControllers";

interface NullComponentProps {
  message: string;
}

export const RoomChatPlaceHolder = () => {
  const ChatRoomsState = useChatStore((state) => state);
  const selectNewChat = useChatStore((state) => state.selectNewChatID);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      // to make it dynamic later
      await fetchRoomsCall(0, 5, true).then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
          toast.error("something went wrong, try again");
        } else {
          const rooms: ChatRoom[] = [];
          res.data.forEach(
            (room: { id: string; name: string; type: string }) => {
              rooms.push({
                id: room.id,
                name: room.name,
                type: RoomType[room.type as keyof typeof RoomType],
                messages: [],
                usersId: [],
                isOwner: true,
                isAdmin: true,
              });
            }
          );
          setIsLoading(false);
          ChatRoomsState.fillRecentRooms(rooms);
        }
      });
    };

    fetch();
    // eslint-disable-next-line
  }, []);

  return ChatRoomsState.recentRooms.length > 0 ? (
    <div>
      {ChatRoomsState.recentRooms.map((room) => (
        <div
          key={room.id}
          onClick={() => selectNewChat(room.id)}
          className="message-container flex   pt-5 pl-5 pb-5 pr-2 bg-[#1A1C26] items-center  hover:bg-[#272932] "
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
                {room?.usersId.length + 1} Members
              </p>
            </div>
            <div className=" flex flex-row justify-between pt-1">
              <p className="text-gray-400 font-poppins text-sm font-medium leading-normal max-w-[80px] md:max-w-[180px]  truncate hidden md:block ">
                {room.messages.length > 0
                  ? room.messages[room.messages?.length - 1]?.message
                  : "No Messages*"}
              </p>
              {room.messages[room.messages?.length - 1]?.isRead === false ? (
                <div className="messages-dot relative  pt-1 hidden  md:block ">
                  <div className="w-3 h-3 bg-red-500 rounded-full text-white flex items-baseline justify-self-end"></div>
                </div>
              ) : (
                <img alt="check" className="hidden md:block" src={check}></img>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="p-3 text-center">
      {isLoading === true ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <NullPlaceHolder message="You have No Rooms Yet!" />
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

  const resetModalState = () => {
    setPassword("");
    setName("");
    setSelectedOption(RoomType.public);
  };
  return (
    <div className="modal " id="my_modal_8">
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
                console.log(RoomType[selectedOption]);
                if (RoomName !== "" && RoomName.length > 3) {
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
                      createNewRoom(RoomName, selectedOption, res.data.id);
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
              {"Create "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AddUsersModal = () => {
  const [MyUsers] = useState(users);

  return (
    <div className="modal " id="my_modal_6">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar  w-[85%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal">
              Select To Add Users
            </p>
          </div>

          {/* Scrollable part */}
          <div className="max-h-[300px] overflow-y-auto no-scrollbar">
            {MyUsers.map((user) => (
              <SelectedUserTile
                key={user.id}
                id={user.id} // Make sure to add a unique key prop
                username={user.name}
                userImage={user.image}
                message={""}
                time={""}
                isMe={false}
                isRead={false}
              />
            ))}
          </div>

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
  const editRoom = useChatStore((state) => state.editRoom);
  const selectedChatID = useChatStore((state) => state.selectedChatID);
  const currentRoom = chatRooms.find((room) => room.id === selectedChatID);
  const currentRoomUsers = users.filter(
    (user) => currentRoom?.usersId.includes(user.id) as boolean
  );

  const setIsLoading = useChatStore((state) => state.setIsLoading);

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
  const [selectedOption, setSelectedOption] = useState(RoomType.public);

  useEffect(() => {
    setSelectedOption(currentRoom?.type as RoomType);
    setName(currentRoom?.name as string);
  }, [currentRoom?.type, currentRoom?.name]);

  const resetModalState = () => {
    setSelectedOption(currentRoom?.type as RoomType);
    setName(currentRoom?.name as string);
  };

  return (
    <div className="modal " id="my_modal_9">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar w-[90%] md:w-[50%] ">
        <div className="flex flex-col">
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
                onChange={() => setSelectedOption(RoomType.public)}
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
                onChange={() => setSelectedOption(RoomType.private)}
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
                onChange={() => setSelectedOption(RoomType.protected)}
              />
            </label>
          </div>

          {/* Conditionally render the text input */}
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
          <p className="p-2">Room Members</p>

          {/* Scrollable part */}
          <div className="max-h-[300px] overflow-y-auto no-scrollbar">
            {currentRoomUsers.map((user) => (
              <div className="flex flex-row justify-between bg-[#1A1C26] p-3   border-gray-600  ">
                <div className="flex flex-row items-center space-x-3">
                  <div className="pr-1">
                    <img
                      className="w-12 rounded-full "
                      alt=""
                      src={user.image}
                    />
                  </div>

                  <p className="text-white font-poppins text-base font-medium leading-normal">
                    {user.name}
                  </p>
                </div>

                <div className="dropdown ">
                  <label tabIndex={0} className="">
                    <summary className="list-none p-3 cursor-pointer ">
                      <img src={More} alt="More" />
                    </summary>
                  </label>
                  <ul
                    tabIndex={0}
                    className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-40 absolute  right-full  "
                  >
                    <li>
                      <span className="hover:bg-[#7940CF]">Ban</span>
                    </li>
                    <li>
                      <span
                        // onClick={onRemoveUserPreview}
                        className="hover:bg-[#7940CF]"
                      >
                        mute
                      </span>
                    </li>

                    <li>
                      <span
                        // onClick={onRemoveUserPreview}
                        className="hover:bg-[#7940CF]"
                      >
                        kick
                      </span>
                    </li>
                    <li>
                      <span className="hover:bg-[#7940CF]">Set as admin</span>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-action">
            {
              // eslint-disable-next-line
            }
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
                console.log(RoomType[selectedOption]);
                if (RoomName !== "" && RoomName.length > 3) {
                  setIsLoading(true);
                  await updateRoomCall(
                    RoomName,
                    RoomType[selectedOption],
                    currentRoom?.id!
                  ).then((res) => {
                    if (res?.status !== 200 && res?.status !== 201) {
                      toast.error("something went wrong, try again");
                      resetModalState();
                    } else {
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
          </div>
        </div>
      </div>
    </div>
  );
};

export const ExploreRoomsModal = () => {
  const [ChatRooms, SetChatRooms] = useState(chatRooms);
  const [selectedOption, setSelectedOption] = useState(RoomType.public);
  const [SelectedRoomID, setSelectedRoomID] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const modalState = useModalStore((state) => state);
  const resetModalState = () => {
    setSelectedOption(RoomType.public);
    setSelectedRoomID("0");
  };

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      await fetchRoomsCall(0, 30, false).then((res) => {
        if (res?.status !== 200 && res?.status !== 201) {
          toast.error("something went wrong, try again");
          resetModalState();
        } else {
          const rooms: ChatRoom[] = [];
          res.data.forEach(
            (room: { id: string; name: string; type: string }) => {
              rooms.push({
                id: room.id,
                name: room.name,
                type: RoomType[room.type as keyof typeof RoomType],
                messages: [],
                usersId: [],
                isOwner: true,
                isAdmin: true,
              });
            }
          );
          setIsLoading(false);
          SetChatRooms(rooms);
        }
      });
    };

    fetch();
  }, [modalState]);

  return (
    <div className="modal " id="my_modal_5">
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
                  {ChatRooms.map((room) => (
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
                </>
              ) : (
                <NullPlaceHolder message="No Rooms Yet!, Create the First" />
              )}
            </div>
          )}
        </div>
        {selectedOption === RoomType.protected && (
          <div className="flex flex-row p-3">
            <div className="flex flex-row w-full justify-center pt-2">
              <p>Room Password</p>
              <input
                type="Password"
                className="input w-full shadow-xl max-w-lg bg-[#272932] placeholder:text-gray-400 font-poppins text-base font-normal leading-normal"
              />
            </div>
          </div>
        )}
        <div className="modal-action">
          {
            // eslint-disable-next-line
          }

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
                // await fetchRoomsCall(0, 5, false).then((res) => {
                //   if (res?.status !== 200 && res?.status !== 201) {
                //     toast.error("something went wrong, try again");
                //     resetModalState();
                //   } else {
                //     res.data.forEach(
                //       (room: { id: string; name: string; type: string }) => {
                //         chatState.createNewRoom(
                //           room.name,
                //           RoomType["public"],
                //           room.id
                //         );
                //       }
                //     );
                //     resetModalState();
                //   }
                // });
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
        className="w-[35%] bottom-2 opacity-50 max-w-xs"
        src={ChatGif}
      ></img>
      <p className="text-gray-500 font-montserrat text-18 font-semibold leading-28 p-3">
        {message}
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
            <Logo x={""} y={""} />
          </div>

          <p>Loading...</p>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
