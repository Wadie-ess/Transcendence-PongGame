import { useEffect, useState } from "react";
import { UserPreviewCard } from "..";
import { Conversation } from "./Conversation";
import { useNavigate, useParams } from "react-router-dom";

import { useChatStore } from "../Controllers/RoomChatControllers";
import { getDM } from "../Services/ChatServices";

export const UserToUserChat = () => {
  const params = useParams();
  const navigator = useNavigate();

  const ChatState = useChatStore((state) => state);
  const [showUserPreview, setShowUserPreview] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await getDM(params.id as string).then((res) => {
          if (res?.status === 200 || res?.status === 201) {
            const extractedData = res.data;
            if (ChatState.selectedChatID !== extractedData.id) {
              ChatState.selectNewChatID(extractedData.id);
            }
            ChatState.setCurrentDmUser({
              id: extractedData.id,
              secondUserId: extractedData.secondMemberId,
              name: extractedData.name,
              avatar: extractedData.avatar,
              bio: extractedData.bio,
            });
          }
        });
      } catch (error) {
        navigator("/chat");
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [params]);
  const handleRemoveUserPreview = () => {
    setShowUserPreview(!showUserPreview);
  };
  return (
    <>
      <div className="flex h-full divide-black divide-x-4">
        <div
          className={` ${
            showUserPreview ? "w-8/12" : "w-full"
          } overflow-hidden bg-gray-900`}
        >
          <Conversation onRemoveUserPreview={handleRemoveUserPreview} />
        </div>
        <div className={` ${showUserPreview ? "w-4/12" : ""}  bg-[#1A1C26]`}>
          {showUserPreview && (
            <UserPreviewCard onRemoveUserPreview={handleRemoveUserPreview} />
          )}
        </div>
      </div>
    </>
  );
};
