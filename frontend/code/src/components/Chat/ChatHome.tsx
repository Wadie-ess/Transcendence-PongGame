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

interface myMessageProps {
  username: string;
  message: string;
  time: string;
  isMe: boolean;
  isRead: boolean;
  userImage: string;
}

// for test
const RowComponent1 = () => {
  return <div className="bg-blue-200">{/* Your content for Row 1 */}</div>;
};

const RowComponent2 = () => {
  return <div className="bg-white">{/* Your content for Row 1 */}</div>;
};

const RowComponent3 = () => {
  return <div className="bg-black">{/* Your content for Row 1 */}</div>;
};

const Chat = () => {
  return (
    <>
      <Layout>
        <div className="grid grid-cols-10  divide-black divide-x-4">
          <div className="col-span-3">
            <RecentMessages />
          </div>
          <div className="col-span-5 bg-gray-900">
            <ConversationHeader />
          </div>
          <div className="col-span-2 bg-gray-500">
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
              {" "}
              Yassine Alaoui
            </p>
            <p className="text-green-500 font-poppins text-base font-medium leading-normal">
              Online
            </p>
          </div>
        </div>
        <img src={More} />
      </div>
    </>
  );
};

export const Conversation = () => {
  return <></>;
};

// to make it dynamic list later !
export const RecentMessages = () => {
  return (
    <div className="">
      <OnlineNowUsers />
      <MessagePlaceHolder
        userImage={UserImage}
        username="a7a 1"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas}
        username="a7a 2"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas2}
        username="a7a 3"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas3}
        username="a7a 4"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas4}
        username="a7a 5"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas5}
        username="a7a 6"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas}
        username="a7a 7"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
      <MessagePlaceHolder
        userImage={yas}
        username="a7a 7"
        message="a7a test"
        time="6:00"
        isRead={true}
        isMe={false}
      />
    </div>
  );
};

export const MessagePlaceHolder = ({
  username,
  message,
  time,
  isRead,
  userImage,
}: myMessageProps) => {
  return (
    <div className="message-container flex   pt-5 pl-5 pb-5 pr-2 hover:bg-[#272932]  bg-[#1A1C26] ">
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
            {message}
          </p>
          <div className="messages-dot relative inline-flex">
            <div className="w-4 h-4 bg-red-500 rounded-full text-white flex items-center justify-center">
              <span className="text-xs  font-medium">5</span>
            </div>
          </div>
        </div>
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
