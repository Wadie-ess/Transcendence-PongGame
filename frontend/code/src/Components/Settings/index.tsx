import Newbie from "../Badges/Newbie.svg";
import Master from "../Badges/Master.svg";
import Ultimate from "../Badges/Ultimate.svg";
import api from "../../Api/base";
import toast from "react-hot-toast";
import { useState, useEffect, useMemo } from "react";
import { Inputs } from "./assets/Inputs";
import { useUserStore } from "../../Stores/stores";
import { UploadLogic } from "../FirstLogin/UploadLogic";

import QRCode from "react-qr-code";

import appStoreIcon from "../images/app-store.svg";
import playStoreIcon from "../images/play-store.svg";
import googleAuthenticatorIcon from "../images/google-authenticator.svg";

export const Setting = () => {
  const TOTPSecretKey = useMemo(
    () => btoa(Math.random().toString(36)).substring(0, 16),
    []
  );

  const [TOTPCode, setTOTPCode] = useState("");

  const getdata: any = async () => {
    const data: any = await api.get("/test");
    return data;
  };

  const user = useUserStore();
  const [myuser, setMyuser] = useState(user);
  const data_names = ["First name", "Last name", "Email", "Username", "Bio"];
  const payload_objects = ["firstName", "lastName", "email", "Username", "discreption"];
  const data_content = [user.name.first, user.name.last, user.email, user.username, user.bio];

  useEffect(() => {
    setMyuser(user);
  }, [myuser, user]);

  return (
    <>
      <div className="pt-6 pl-6 flex flex-col gap-6 h-full w-full font-poppins font-medium">
        <h1 className="font-poppins font-medium text-xl text-neutral">
          Profile Settings
        </h1>
        <div className="flex flex-col bg-base-200 rounded-tl-2xl">
          <div className="flex justify-center h-1/3 w-full pt-6 px-6">
            <div className="flex flex-col sm:flex-row w-full items-center gap-4 p-8 sm:justify-between justify-center overflow-hidden no-scrollbar max-h-[30vh] h-[25vh] bg-base-100 border-solid border-gray-400 border-2 rounded-3xl">
              <div className="flex justify-between items-center  gap-x-10 px-2 sm:px-0">
                <div className="relative">
                  <UploadLogic />
                </div>
                <div className="flex flex-col items-stretch justify-evenly gap-y-4">
                  <div className="text-neutral break-words break-all font-poppins font-medium text-sm sm:text-xl">
                    {myuser.name.first} {myuser.name.last}
                  </div>
                  <div className="font-poppins font-medium text-sm sm:text-lg">
                    {user.bio}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-x-2 xl:gap-x-8">
                <div
                  onClick={() => {
                    toast.promise(getdata(), {
                      loading: "Saving...",
                      success: <b>fetched</b>,
                      error: <b>could not fetch</b>,
                    });
                  }}
                ></div>
                <img
                  className={`h-[9vh] md:h-[12vh] xl:h-[14vh] ${myuser?.achievement !== null && myuser?.achievement >= 0   ? "":"opacity-30"}`}
                  src={Newbie}
                  alt="newbie badge"
                />
                <img
                  className={`h-[9vh] md:h-[12vh] xl:h-[14vh] ${myuser?.achievement !== null && myuser?.achievement >= 1   ? "":"opacity-30"}`}
                  src={Master}
                  alt="Master badge"
                />
                <img
                  className={`h-[9vh] md:h-[12vh] xl:h-[14vh] ${myuser?.achievement !== null && myuser?.achievement >= 2   ? "":"opacity-30"}`}
                  src={Ultimate}
                  alt="Ultimate badge"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full pt-6 px-6">
            <div className="flex flex-col sm:flex-row justify-between w-full bg-base-100 border-solid border-gray-400 border-2 rounded-3xl">
              <div className="h-full p-8 grid md:grid-cols-2 grid-cols-1 w-full gap-4">
                {data_names.map((x, index) => (
                  <div className="w-full flex justify-center items-center">
                    <Inputs
                      key={index}
                      name={x}
                      data={data_content[index]}
                      payload={payload_objects[index]}
                      className="bg-transparent text-left rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full pt-6 px-6">
            <div className="flex flex-col sm:flex-row justify-between w-full bg-base-100 border-solid border-gray-400 border-2 rounded-3xl">
              <div className="h-full p-8 grid grid-cols-1 w-full">
                <div className="w-full flex justify-center items-center">
                  {user.tfa === false ? (
                    <div className="flex flex-col">
                      <h4 className="font-medium tracking-wide text-neutral mb-4 text-center">
                        How to Enable two factor Auth
                      </h4>
                      <div className="flex justify-center items-center gap-x-6">
                        <div className="flex flex-col justify-between items-center p-4 h-52 w-52 rounded-2xl border-2 border-violet-600 bg-accent">
                          <span className="text-xs font-medium h-8 flex items-center justify-center">
                            Install Google Auth
                          </span>
                          <img
                            alt="no"
                            src={googleAuthenticatorIcon}
                            className="w-24 h-24"
                          />
                          <div className="w-full h-8 grid grid-cols-2 gap-1">
                            <img
                              alt="no"
                              src={appStoreIcon}
                              className="w-auto h-8 object-contains"
                            />
                            <img
                              alt="no"
                              src={playStoreIcon}
                              className="w-auto h-8 object-contains" 
                            />
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-center p-4 h-52 w-52 rounded-2xl border-2 border-violet-600 bg-accent">
                          <span className="text-xs font-medium h-8 flex items-center justify-center">
                            Scan the QR
                          </span>
                          <QRCode
                            value={`otpauth://totp/PingPong:${user.email}?secret=${TOTPSecretKey}&period=30&digits=6&algorithm=SHA1&issuer=PingPong`}
                            className="w-24 h-24"
                          />
                          <span className="text-xs font-medium h-8 flex items-center justify-center">
                            {TOTPSecretKey}
                          </span>
                        </div>
                        <div className="flex flex-col justify-between items-center p-4 h-52 w-52 rounded-2xl border-2 border-violet-600 bg-accent">
                          <span className="text-xs font-medium h-8 flex items-center justify-center">
                            Verify your device
                          </span>
                          <div className="w-full h-24 flex flex-col items-center justify-center gap-2">
                            <span className="text-xs font-medium">
                              Enter your code
                            </span>
                            <input
                              type="text"
                              placeholder="000000"
                              className="w-[70%] text-center border border-violet-600 bg-black rounded tracking-wider leading-none py-0.5"
                              maxLength={6}
                              onKeyDown={(event) => {
                                if (
                                  (event.key >= "0" && event.key <= "9") ||
                                  event.key === "Backspace"
                                )
                                  return true;
                                event.preventDefault();
                                return false;
                              }}
                              value={TOTPCode}
                              onChange={(event) => {
                                const value = event.target.value;
                                setTOTPCode(value || "");
                              }}
                            />
                          </div>
                          <button
                            className="btn bg-gray-200 text-black text-xs hover:btn-primary hover:text-white !h-8 !min-h-0"
                            onClick={async () => {
                              try {
                                const response = await api.post(
                                  "/users/enableTwoFactorAuth",
                                  {
                                    otp: TOTPCode,
                                    secret: TOTPSecretKey,
                                    action: "enable",
                                  }
                                );
                                user.toggleTfa();
                                toast.success(response.data.message);
                              } catch (e: any) {
                                toast.error(e.response.data.message);
                              }
                            }}
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <h4 className="font-medium tracking-wide text-neutral mb-4 text-center">
                        How to Disable two factor Auth
                      </h4>
                      <div className="flex justify-center items-center gap-x-6">
                        <div className="flex flex-col justify-between items-center p-4 h-52 w-52 rounded-2xl border-2 border-violet-600 bg-accent">
                          <span className="text-xs font-medium h-8 flex items-center justify-center">
                            Verify your device
                          </span>
                          <div className="w-full h-24 flex flex-col items-center justify-center gap-2">
                            <span className="text-xs font-medium">
                              Enter your code
                            </span>
                            <input
                              type="text"
                              placeholder="000000"
                              className="w-[70%] text-center border border-violet-600 bg-black rounded tracking-wider leading-none py-0.5"
                              maxLength={6}
                              onKeyDown={(event) => {
                                if (
                                  (event.key >= "0" && event.key <= "9") ||
                                  event.key === "Backspace"
                                )
                                  return true;
                                event.preventDefault();
                                return false;
                              }}
                              value={TOTPCode}
                              onChange={(event) => {
                                const value = event.target.value;
                                setTOTPCode(value || "");
                              }}
                            />
                          </div>
                          <button
                            className="btn bg-gray-200 text-black text-xs hover:btn-primary hover:text-white !h-8 !min-h-0"
                            onClick={async () => {
                              try {
                                const response = await api.post(
                                  "/users/enableTwoFactorAuth",
                                  {
                                    otp: TOTPCode,
                                    action: "disable",
                                  }
                                );
                                user.toggleTfa();
                                toast.success(response.data.message);
                              } catch (e: any) {
                                toast.error(e.response.data.message);
                              }
                            }}
                          >
                            Verify
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </>
  );
};
