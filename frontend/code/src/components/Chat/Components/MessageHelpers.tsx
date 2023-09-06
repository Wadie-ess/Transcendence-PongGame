import Send from "../assets/send_icon.svg";
import yas from "../assets/alaoui.png";










interface myMessageProps {
    username: string;
    message: string;
    time: string;
    isMe: boolean;
    isRead: boolean;
    userImage: string;
  }











  export const CurrentUserMessage = () => {
    return (
      <div className="chat chat-end p-5">
        <div className="chat-bubble bg-purple-500 text-white">nn hh </div>
      </div>
    );
  };
  export const UserMessage = () => {
    return (
      <>
        <div className="chat chat-start p-5">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <img src={yas} />
            </div>
          </div>
          <div className="chat-header p-1">
            <time className="text-gray-400 font-poppins text-xs font-light leading-normal">
              12:45 PM
            </time>
          </div>
          <div className="chat-bubble">{"Fiha chi Kharja l Marakech?"}</div>
          <div className="chat-footer p-1 text-gray-400 font-poppins text-xs font-light leading-normal">
            Delivered
          </div>
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