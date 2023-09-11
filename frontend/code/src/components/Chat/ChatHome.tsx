import { Layout } from "../Layout";
import UserImage from "./assets/aymane.png";
import yas from "./assets/alaoui.png";
import yas1 from "./assets/alaoui.png";
import yas2 from "./assets/3.png";
import yas3 from "./assets/4.png";
import yas4 from "./assets/5.png";
import yas5 from "./assets/6.png";
import SearchIcon from "./assets/Search_icon.svg";
import EditIcon from "./assets/Edit_icon.svg";
import More from "./assets/more_icon.svg";
import Send from "./assets/send_icon.svg";
import Close from "./assets/close_icon.svg";
import Bio from "./assets/bio_icon.svg";
import { useState } from "react";
import {
  CurrentUserMessage,
  MessagePlaceHolder,
  UserMessage,
} from "./Components/MessageHelpers";

interface ConversationProps {
  onRemoveUserPreview: () => void; // Define the prop to accept the function
}

const Chat = () => {
  const [showUserPreview, setShowUserPreview] = useState(true);

  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };
  return (
    <>
      <Layout>
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
      </Layout>
    </>
  );
};

export const UserPreviewCard: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  return (
    <div className="flex flex-col p-4 ">
      <div className="flex flex-row justify-between ">
        <p className="text-white font-poppins font-light text-base">
          Person Info
        </p>
        <button onClick={onRemoveUserPreview}>
          <img alt="" src={Close} />
        </button>
      </div>
      <div className="flex flex-row justify-center p-4">
        <img className="w-36 rounded-full " alt="" src={yas} />
      </div>
      <div className="flex flex-row justify-center p-1 text-gray-400 font-poppins font-medium text-base">
        <p>Friend</p>
      </div>
      <div className="flex flex-row  text-gray-400 font-poppins font-medium text-base ">
        <img alt="" src={Bio} />
        <p className="pl-2">Yassin's Bio</p>
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
  return (
    <>
      <div className="flex flex-row justify-between bg-[#1A1C26] p-3 border-b-2  border-black  ">
        <div className="flex flex-row ">
          <div className="pr-1">
            <img className="w-12 rounded-full " alt="" src={yas} />
          </div>
          <div className="flex flex-col pl-2 ">
            <p className="text-white font-poppins text-base font-medium leading-normal">
              {" Yassine Alaoui"}
            </p>
            <p className="text-green-500 font-poppins text-sm font-medium leading-normal">
              Online
            </p>
          </div>
        </div>
        {/* <div className="dropdown pt-2">
          <label tabIndex={0} className="list-none  cursor-pointer">
            <img src={More} alt="More" />
          </label>
          <ul className="shadow menu p-2 dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute  right-full">
            <li>
              <a href="gg" className="hover:bg-[#7940CF]">
                Block
              </a>
            </li>
            <li>
              <a href="gg" className="hover:bg-[#7940CF]">
                Unfriend
              </a>
            </li>
            <li onClick={onRemoveUserPreview}>
              <a
                onClick = {
                  ()=> console.log("hhh")
                }
                className="hover:bg-[#7940CF]"
              >
                Show User Info
              </a>
            </li>
          </ul>
        </div> */}
        <details  className="relative ">
          <summary className="list-none p-3 cursor-pointer ">
            <img src={More} alt="More" />
          </summary>
          <ul  className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute  right-full  ">
            <li>
              <a href="gg" className="hover:bg-[#7940CF]">
                Block
              </a>
            </li>
            <li>
              <a href="gg" className="hover:bg-[#7940CF]">
                Unfriend
              </a>
            </li>
            <li>
              <a onClick={onRemoveUserPreview} className="hover:bg-[#7940CF]">
                Show User Info
              </a>
            </li>
          </ul>
        </details>
      </div>
    </>
  );
};

export const MessageTextInput = () => {
  return (
    <div className="flex flex-row  m-5 justify-evenly ">
      <input
        type="text"
        placeholder="Type Message"
        className="input w-full shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 font-poppins text-base font-normal leading-normal "
      />

      <button className="btn  ml-4 btn-square  bg-[#8C67F6]">
        <img src={Send} />
      </button>
    </div>
  );
};

export const Conversation: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const [Messages, SetMessages] = useState([
    {
      userImage: UserImage,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas2,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: true,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
  ]);
  return (
    <div className="flex flex-col h-[90%] ">
      <ConversationHeader onRemoveUserPreview={onRemoveUserPreview} />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {Messages.map((message) =>
          message.isMe ? <CurrentUserMessage /> : <UserMessage />
        )}
      </div>

      <div className="fixed bottom-2  mx-auto w-[40%]">
        <MessageTextInput />
      </div>
    </div>
  );
};

// to make it dynamic list later !
export const RecentConversations = () => {
  const [Conversation, SetConversation] = useState([
    {
      userImage: UserImage,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas1,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas2,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas3,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas4,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: yas5,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: UserImage,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
    {
      userImage: UserImage,
      username: "a7a 1",
      message: "a7a test",
      time: "6:00",
      isRead: true,
      isMe: false,
    },
  ]);

  return (
    <div className="h-full flex flex-col">
      <OnlineNowUsers />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {Conversation.map((message) => (
          <MessagePlaceHolder
            key={message.userImage}
            username={message.username}
            message={message.message}
            time={message.time}
            isMe={message.isMe}
            isRead={message.isRead}
            userImage={message.userImage}
          />
        ))}
      </div>
    </div>
  );
};

// to refactor it and make it a dynamic list of 5
export const OnlineNowUsers = () => {
  return (
    <>
      <div className="online-now-container    pt-5 pl-5 pb-2 pr-3 bg-[#1A1C26]">
        <div className="messages-header flex flex-row justify-between pb-2">
          <p className="text-purple-500 font-poppins text-lg font-medium leading-normal ">
            Messages
          </p>
          <div className="icons-row flex flex-row  ">
            <img className="mr-5" src={SearchIcon} />
            <img src={EditIcon} />
          </div>
        </div>
        <div className="message-row flex flex-row pt-2 justify-between">
          <p className="text-gray-400 font-poppins text-xs font-medium leading-normal ">
            Online Now
          </p>
          <p className="text-gray-400 font-poppins text-xs font-medium leading-normal ">
            See All
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
export default Chat;
