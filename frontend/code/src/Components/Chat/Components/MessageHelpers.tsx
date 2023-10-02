import { useState } from "react";
import { SelectedUserTile } from "..";
import users, {
  UserImage,
  yas1,
  yas2,
  yas3,
  yas4,
  GroupChat,
  check,
  Message,
  RoomsIcon,
  ChatIcon,
} from "../Components/tools/Assets";
import { ChatType, useBearStore } from "../Controllers/ChatState";

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

  const SelectedChat = useBearStore((state) => state.selectedChatID);

  const currentChatMessages = MyUsers.find((user) => user.id === SelectedChat);
  return senderId === 2 ? (
    <div className="chat chat-end p-2 pl-5 ">
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {time} PM
        </time>
      </div>
      <div className=" max-w-max chat-bubble bg-purple-500 text-white whitespace-normal  break-words">
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
          <img src={currentChatMessages?.image} alt="" />
        </div>
      </div>
      <div className="chat-header p-1">
        <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
          {time} PM
        </time>
      </div>

      <div className="max-w-max chat-bubble whitespace-normal  break-words">
        {message}
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
  const selectNewChat = useBearStore((state) => state.selectNewChatID);
  const selectedChatID = useBearStore((state) => state.selectedChatID);

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
          <p className="text-gray-400 font-poppins text-sm font-medium leading-normal ">
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
  const [MyUsers] = useState(users);

  const [selectedOption, setSelectedOption] = useState("Public"); // Initialize with a default value

  const selectedChatType = useBearStore((state) => state.selectedChatType);
  const changeChatType = useBearStore((state) => state.changeChatType);

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };
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
            <div className="modal " id="my_modal_8">
              <div className="modal-box bg-[#1A1C26]  no-scrollbar ">
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
                        type="text"
                        placeholder="Set The Group Name"
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
                        checked={selectedOption === "Public"}
                        onChange={handleOptionChange}
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text pr-2">Private</span>
                      <input
                        type="radio"
                        name="radio-10"
                        value="Private"
                        className="radio checked:bg-red-500"
                        checked={selectedOption === "Private"}
                        onChange={handleOptionChange}
                      />
                    </label>
                    <label className="label cursor-pointer">
                      <span className="label-text pr-2">Protected</span>
                      <input
                        type="radio"
                        name="radio-10"
                        value="Protected"
                        className="radio checked:bg-orange-500"
                        checked={selectedOption === "Protected"}
                        onChange={handleOptionChange}
                      />
                    </label>
                  </div>

                  {/* Conditionally render the text input */}
                  {selectedOption === "Protected" && (
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
                  <p className="p-2">Select To Add Friends</p>

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

                  <div className="modal-action">
                    {
                      // eslint-disable-next-line
                    }
                    <a href="#" className="btn hover:bg-purple-500">
                      {"Done "}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Message-Type-Buttons flex flex-row pt-2 pb-2 justify-between ">
          <button
            onClick={() => changeChatType(ChatType.Chat)}
            className={`${
              selectedChatType === ChatType.Chat ? "bg-[#272932]" : ""
            } flex-1 p-2 rounded hover:bg-[#272932] `}
          >
            <div className=" flex flex-row justify-center ">
              <p className="text-gray-300 font-poppins text-base font-medium leading-normal pr-3 ">
                Chat
              </p>
              <img src={ChatIcon}></img>
            </div>
          </button>
          <button onClick={() => changeChatType(ChatType.Room)} className={`${
              selectedChatType === ChatType.Room ? "bg-[#272932]" : ""
            } flex-1 p-2 rounded hover:bg-[#272932] `}>
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
        <div className="users-images flex flex-row justify-between pt-3 ">
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
