import {
  UserImage,
  yas,
  yas1,
  yas2,
  yas3,
  yas4,
  SearchIcon,
  EditIcon,
  More,
  Send,
  Close,
  Bio,
  GroupChat,
} from "./Components/tools/Assets";
import { useState } from "react";
import {
  CurrentUserMessage,
  ChatPlaceHolder,
  UserMessage,
  OnlineNowUsers,
} from "./Components/MessageHelpers";
import { myConversationProps } from "./Components/MessageHelpers";
import { MessageDummy } from "./Components/tools/Assets";

interface ConversationProps {
  onRemoveUserPreview: () => void;
}

export const Chat = () => {
  const [showUserPreview, setShowUserPreview] = useState(true);

  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };
  return (
    <>
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
          Yassin's Info
        </p>
        <button onClick={onRemoveUserPreview}>
          <img alt="" src={Close} />
        </button>
      </div>
      <div className="flex flex-row justify-center p-4">
        <img className="w-36 rounded-full " alt="" src={yas} />
      </div>
      <div className="flex flex-row justify-center p-1 text-white font-poppins text-26 font-medium">
        <p>Yassine Alaoui</p>
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
              <span className="hover:bg-[#7940CF]">Unfriend</span>
            </li>
            <li>
              <span
                onClick={onRemoveUserPreview}
                className="hover:bg-[#7940CF]"
              >
                Show User Info
              </span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export const MessageTextInput = () => {
  return (
    <div className="">
      <div className="flex flex-row  m-5 justify-evenly ">
        <div className="flex flex-row w-full justify-center ">
          <input
            type="text"
            placeholder="Type Message"
            className="input w-full shadow-md max-w-lg bg-[#1A1C26]  placeholder:text-gray-400 font-poppins text-base font-normal leading-normal "
          />

          <button className="btn  ml-4 btn-square  bg-[#8C67F6] hover:bg-green-600">
            <img src={Send} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Conversation: React.FC<ConversationProps> = ({
  onRemoveUserPreview,
}) => {
  const [Messages] = useState(MessageDummy);
  return (
    <div className="flex flex-col h-[99%] ">
      <ConversationHeader onRemoveUserPreview={onRemoveUserPreview} />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {Messages.map((message) =>
          message.isMe ? <CurrentUserMessage /> : <UserMessage />
        )}
      </div>

      <div className=" bottom-2   ">
        {" "}
        <MessageTextInput />
      </div>
    </div>
  );
};

// to make it dynamic list later !
export const RecentConversations = () => {
  const [Conversation] = useState(MessageDummy);

  return (
    <div className="h-full flex flex-col">
      <OnlineNowUsers />
      <div className="flex-grow overflow-y-auto no-scrollbar">
        {Conversation.map((message) => (
          <ChatPlaceHolder
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


export const SelectedUserTile = ({
  username,
  userImage,
}: myConversationProps) => {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}

          <tbody>
            {/* row 1 */}
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src={userImage}
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{username}</div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
