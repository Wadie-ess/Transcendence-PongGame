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
import { useState } from "react";
import {
  CurrentUserMessage,
  MessagePlaceHolder,
  UserMessage,
} from "./Components/MessageHelpers";

// for test

const RowComponent3 = () => {
  return <div className="bg-black">{/* Your content for Row 1 */}</div>;
};

const Chat = () => {
  return (
    <>
      <Layout>
        <div className="flex h-full  divide-black divide-x-4">
          <div className="w-4/12">
            <RecentMessages />
          </div>
          <div className="w-6/12 overflow-hidden bg-gray-900">
            <Conversation />
          </div>
          <div className="w-3/12 bg-[#1A1C26]">
            <RowComponent3 />
          </div>
        </div>
      </Layout>
    </>
  );
};

export const ConversationHeader = () => {
  return (
    <>
      <div className="flex flex-row justify-between bg-[#1A1C26] p-4 border-b-2  border-black border- ">
        <div className="flex flex-row ">
          <img src={yas} className="w-[18%] h-[95%]" />
          <div className="flex flex-col pl-2 ">
            <p className="text-white font-poppins text-base font-medium leading-normal">
              {" Yassine Alaoui"}
            </p>
            <p className="text-green-500 font-poppins text-sm font-medium leading-normal">
              Online
            </p>
          </div>
        </div>
        <details className="relative pt-2">
          <summary className="list-none">
            <img src={More} alt="More" />
          </summary>
          <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute  right-full  ">
            <li>
              <a className="hover:bg-[#7940CF]">Block</a>
            </li>
            <li>
              <a className="hover:bg-[#7940CF]">Unfriend</a>
            </li>
          </ul>
        </details>
      </div>
    </>
  );
};

export const MessageTextInput = () => {
  return (
    <div className="flex flex-row  m-5 justify-evenly">
      <input
        type="text"
        placeholder="Type Message"
        className="input w-full shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 font-poppins text-base font-normal leading-normal "
      />

      <button className="btn btn-square bg-[#8C67F6]">
        <img src={Send} />
      </button>
    </div>
  );
};

export const Conversation = () => {
  return (
    <div className="flex flex-col ">
      <ConversationHeader />
      <UserMessage />
      <CurrentUserMessage />
      <MessageTextInput />
    </div>
  );
};

// to make it dynamic list later !
export const RecentMessages = () => {
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
        {Messages.map((message) => (
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
