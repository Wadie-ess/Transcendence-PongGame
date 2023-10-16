import { SetStateAction, useState } from "react";
import { useChatStore } from "../Controllers/ChatControllers";
import users, {
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
import { api } from "../../../Api/base";
import { createNewRoomCall } from "../Services/ChatServices";

interface NullComponentProps {
  message: string;
}

export const RoomChatPlaceHolder = () => {
  const ChatRooms = useChatStore((state) => state.recentRooms);
  const selectNewChat = useChatStore((state) => state.selectNewChatID);
  return ChatRooms.length > 0 ? (
    <div>
      {ChatRooms.map((room) => (
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
                {room?.usersId.length} Members
              </p>
            </div>
            <div className=" flex flex-row justify-between pt-1">
              <p className="text-gray-400 font-poppins text-sm font-medium leading-normal max-w-[80px] md:max-w-[180px]  truncate hidden md:block ">
                {room.messages[room.messages?.length - 1]?.message}
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
    <NullPlaceHolder message="No Rooms Created Yet, Create The First " />
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

  const [selectedOption, setSelectedOption] = useState(RoomType.public); // Initialize with a default value

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
                  const response = await createNewRoomCall(
                    RoomName,
                    RoomType[selectedOption],
                    RoomPassword
                  ).then((res) => {
                    if (res != 200 && res != 201) {
                      // show dialog or toast
                      resetModalState();
                    } else {
                      createNewRoom(RoomName, selectedOption, RoomPassword);
                      resetModalState();
                    }
                  });
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
  const selectedChatID = useChatStore((state) => state.selectedChatID);
  const currentRoom = chatRooms.find((room) => room.id === selectedChatID);
  const currentRoomUsers = users.filter(
    (user) => currentRoom?.usersId.includes(user.id) as boolean
  );

  const [selectedOption, setSelectedOption] = useState(currentRoom?.type); // Initialize with a default value

  const resetModalState = () => {
    setSelectedOption(RoomType.public);
  };
  return (
    <div className="modal " id="my_modal_9">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar w-[90%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal">
              {currentRoom?.name}'s Settings
            </p>
          </div>
          <div className="flex flex-row p-3">
            <div className="flex flex-row w-full justify-center pt-2">
              <img className="mr-2" alt="" src={GroupChat} />
              <input
                value={currentRoom?.name}
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
              onClick={() => {
                resetModalState();
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
  const [ChatRooms] = useState(chatRooms);
  const [selectedOption, setSelectedOption] = useState(RoomType.public);
  const [SelectedRoomID, setSelectedRoomID] = useState(0); // Initialize with a default value

  const resetModalState = () => {
    setSelectedOption(RoomType.public);
    setSelectedRoomID(0);
  };

  return (
    <div className="modal " id="my_modal_5">
      <div className="modal-box bg-[#1A1C26]  no-scrollbar  w-[85%] md:w-[50%] ">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center">
            <p className="text-purple-500 font-poppins text-lg font-medium leading-normal m-2">
              Explore and Join Rooms
            </p>
          </div>

          {/* Scrollable part */}
          <div className="max-h-[320px] overflow-y-auto no-scrollbar">
            {ChatRooms.map((room) => (
              <div
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
                      src={room.type === RoomType.protected ? Lock : Unlock}
                    />
                  </a>
                </div>
              </div>
            ))}
          </div>
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
          <a
            href="#/"
            onClick={() => {
              resetModalState();
            }}
            className="btn hover:bg-purple-500"
          >
            {"Join"}
          </a>
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
      <img alt="null" className="w-[35%] bottom-2" src={NullImage}></img>
      <p className="text-gray-500 font-montserrat text-18 font-semibold leading-28">
        {message}
      </p>
    </div>
  );
};
