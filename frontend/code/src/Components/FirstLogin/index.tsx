import { UploadAvatar } from "./UploadAvatar";

export const FirstLogin = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="rounded-xl p-8 md:py-12 md:px-16 bg-base-100 border-2 border-purple-500 max-w-lg w-full">
        <div className="flex flex-col gap-6 justify-center items-center content-center w-full">
          <UploadAvatar />
        </div>
      </div>
    </div>
  );
};
