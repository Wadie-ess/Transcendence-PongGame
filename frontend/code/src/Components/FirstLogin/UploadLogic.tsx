import { useRef } from "react";
import { Avatar } from "../Settings/assets/Avatar";
import { Edit } from "../Settings/assets/Edit";
import { useUserStore } from "../../Stores/stores";
import api from "../../Api/base";
import { toast } from "react-hot-toast";
export const UploadLogic = () => {
  const userStore = useUserStore();
  const inputRef = useRef<any>();
  const handleUploadedFile = async (event: any) => {
    const h_size = event.target.files[0].size / 1024;
    if (h_size > 5120) {
      toast.error("uploded avatar is bigger than 5mb");
      return Promise.reject("Error");
    }
    const formData = new FormData();
    formData.append("image", event.target.files[0]);

    await api.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const res = await api.get("/profile/me");
    userStore.setAvatar(res?.data?.picture);
  };
  const handleClick = () => {
    inputRef?.current?.click();
  };
  return (
    <>
      <div className="relative">
        <Avatar picture={userStore.picture.medium} />
        <div className="absolute bottom-0 right-0" onClick={handleClick}>
          <Edit />
        </div>
      </div>
      <input
        type="file"
        className="hidden"
        id="picture"
        onChange={(e) => {
          toast.promise(
            handleUploadedFile(e),
            {
              loading: "Updating Profile Image",
              success: "New Avatar Saved",
              error: "Error On Uploading image",
            },
            { position: "top-center", className: "h-20", duration: 2000 },
          );
        }}
        ref={inputRef}
      />
    </>
  );
};
