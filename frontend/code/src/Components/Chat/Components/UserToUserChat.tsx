import { useState } from "react";
import { Conversation, UserPreviewCard } from "..";

export const UserToUserChat = () => {
  const [showUserPreview, setShowUserPreview] = useState(true);

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
