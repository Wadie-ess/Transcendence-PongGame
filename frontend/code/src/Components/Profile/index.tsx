import { Pong } from "./assets/Pong";

import { History } from "./History";
import Hero from "./assets/Hero.gif";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Load } from "../Loading/";
import Newbie from "../Badges/Newbie.svg";
import Master from "../Badges/Master.svg";
import Ultimate from "../Badges/Ultimate.svg";
import { useUserStore } from "../../Stores/stores";
import {
  VscChromeClose,
  VscAdd,
  VscCheck,
  VscComment,
  VscEdit,
} from "react-icons/vsc";
import api from "../../Api/base";
import toast from "react-hot-toast";
import { createNewRoomCall } from "../Chat/Services/ChatServices";
import { useSocketStore } from "../Chat/Services/SocketsServices";
import {
  ChatType,
  useChatStore,
} from "../Chat/Controllers/RoomChatControllers";
import { More } from "../Chat/Components/tools/Assets";
import { useModalStore } from "../Chat/Controllers/LayoutControllers";
import { BlockedUsersModal } from "../Chat/Components/RoomChatHelpers";
import { blockUserCall } from "../Chat/Services/FriendsServices";
import { AxiosError } from "axios";
import { InvitationWaiting } from "../Layout/Assets/Invitationacceptance";
import { classNames } from "../../Utils/helpers";
type FRIENDSHIP = "none" | "friend" | "sent" | "recive" | "blocked" | undefined;
export const Profile = () => {
  const user = useUserStore();
  const params = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<FRIENDSHIP>(undefined);
  const [disabled, setDisabled] = useState("");
  console.log(`params : ${params.id} type ${typeof params.id}`);
  const [profile, setProfile] = useState<null | any>(undefined);
  const ChatState = useChatStore();
  const LayoutState = useModalStore();
  const socketStore = useSocketStore();
  const [onlineStatus, setOnlineStatus] = useState<string>("offline");

  const inviteWaitingModalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`profile/${params.id}`);
        setProfile(res.data);
        res.data.friendship.length === 0 && setStatus("none");
        res.data.friendship.length > 0 &&
          res.data.friendship[0].accepted &&
          setStatus("friend");
        res.data.friendship.length > 0 &&
          !res.data.friendship[0].accepted &&
          res.data.friendship[0].fromId === user.id &&
          setStatus("sent");
        res.data.friendship.length > 0 &&
          !res.data.friendship[0].accepted &&
          res.data.friendship[0].fromId !== user.id &&
          setStatus("recive");
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error?.response?.status !== 401) navigate("/NotFound");
        }
      }
    };
    if (params.id !== user.id || params.id !== "me") fetchUser();
    else setProfile(user);

    //eslint-disable-next-line
  }, [params, user]);

  useEffect(() => {
    if (params.id === "me" || params.id === user.id) {
      return;
    }
    socketStore?.socket?.emit(
      "status",
      { userId: params.id },
      (data: { status: string; inGame: boolean }) => {
        console.log(data);
        if (data.status === "online" && !data.inGame) {
          setOnlineStatus("online");
        } else if (data.status === "online" && data.inGame) {
          setOnlineStatus("inGame");
        } else {
          setOnlineStatus("offline");
        }
      },
    );
  }, [params.id, socketStore?.socket, user.id]);

  console.log(status);
  const sendRequest = async () => {
    setDisabled("btn-disabled");
    const fetchFunc = async () => {
      await api.post("friends/add", { friendId: profile.id });
      setStatus("sent");
      setDisabled("");
    };
    toast.promise(fetchFunc(), {
      loading: `Sending friend request`,
      success: `request sent to ${profile.name.first}`,
      error: "could not send friend request",
    });
    // setDisbaled("")
  };
  const cancelRequest = async () => {
    setDisabled("btn-disabled");
    const fetchFunc = async () => {
      await api.post("friends/unfriend", { friendId: profile.id });
      setStatus("none");
      setDisabled("");
    };
    toast.promise(fetchFunc(), {
      loading: `Cancling friend request`,
      success: `cancel ${profile.name.first} friend request`,
      error: "could not cancel friend request",
    });
  };
  const acceptRequest = async () => {
    setDisabled("btn-disabled");
    const fetchFunc = async () => {
      await api.post("/friends/accept", { friendId: profile.id });
      setStatus("friend");
      setDisabled("");
    };
    toast.promise(fetchFunc(), {
      loading: `Accepting friend request`,
      success: `${profile.name.first} friend request accepted`,
      error: "could not accept friend request",
    });
  };
  const rejectRequest = async () => {
    setDisabled("btn-disabled");
    const fetchFunc = async () => {
      await api.post("/friends/reject", { friendId: profile.id });
      setStatus("none");
      setDisabled("");
    };
    toast.promise(fetchFunc(), {
      loading: `rejecting friend request`,
      success: `${profile.name.first} friend request rejected`,
      error: "could not reject friend request",
    });
  };

  return (
    <>
      <BlockedUsersModal />
      <div className=" flex flex-col items-center h-full bg-accent">
        <div className="relative pt-12 h-auto max-h-[30vh] min-h-[16vh] md:min-h-[28vh] xl:min-h-[33vh] w-[85vw]">
          <div className="relative h-full w-full md:px-32 bg-[#2b3bfb] rounded-t-3xl">
            <img
              className="flex-1  w-full h-auto object-scale-down md:object-top object-bottom rounded-t-3xl"
              src={Hero}
              alt="bg hero"
            ></img>
            <div className=" absolute  bg-black top-0 left-0  object-scale-down object-top  opacity-40 h-full w-full rounded-t-3xl  z-10"></div>
            <Pong />
          </div>

          <div className="avatar w-[10vw] absolute z-40 -bottom-4 sm:-bottom-6 md:-bottom-11 left-6 sm:left-12 ">
            <div className="w-[13vw] xl:w-[8vw] rounded-full ring ring-neutral flex justify-center items-center ring-offset-base-100 ring-offset-1">
              {profile?.picture?.large ? (
                <img src={profile?.picture?.large} alt="profile avatar" />
              ) : (
                <div className=" top-14">
                  <Load />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative flex flex-row gap-y-4 sm:gap-y-0 pl-4  text-neutral font-montserrat bg-base-200  justify-between  items-start h-[15%] xl:h-[30%] xl:min-h-[27%] min-h-[25%] rounded-b-3xl w-[85vw] ">
          <div className="flex flex-col pt-2">
            <div className="sm:pt-12  pt-4 font-poppins font-bold text-xl ">
              {profile?.name?.first ? (
                <>
                  {profile?.name?.first} {"  "} {profile.name.last}
                </>
              ) : (
                <Load />
              )}

              {params.id !== "me" &&
                params.id !== user.id &&
                status === "friend" && (
                  <span
                    className={classNames(
                      "px-2 py-1 font-light ml-2 text-xs border rounded-full",
                      onlineStatus === "online"
                        ? "text-green-500 border-green-500"
                        : onlineStatus === "inGame"
                        ? "text-yellow-500 border-yellow-500"
                        : "text-red-500 border-red-500",
                    )}
                  >
                    {onlineStatus}
                  </span>
                )}
            </div>

            <div className="flex flex-row  items-center  pt-2 text-xs">
              {"@"}
              {profile?.username}
            </div>

            <div className="flex flex-col gap-y-0 items-center h-full sm:flex-row sm:gap-x-4 justify-center sm:justify-start sm:items-end pb-4 sm:w-[25vw]">
              {/* for debug */}
              {/* <button
                className={`btn btn-primary text-neutral ${disabled}`}
                onClick={async () => {
                  ChatState.setIsLoading(true);
                  await blockUserCall(profile.id).then((res) => {
                    ChatState.setIsLoading(false);
                    if (res?.status === 200 || res?.status === 201) {
                      toast.success("User Blocked");
                      navigate("/home");
                    } else {
                      toast.error("Could Not Block User");
                    }
                  });
                }}
              >
                <VscComment />
                Message
              </button> */}
              {params.id !== "me" &&
                params.id !== user.id &&
                status === "none" && (
                  <div className=" flex items-center w-[70%] gap-x-5 h-20">
                    <button
                      className={`btn w-5/6 btn-primary text-neutral ${disabled}`}
                      onClick={sendRequest}
                    >
                      <VscAdd />
                      Send request
                    </button>
                    <div className="dropdown">
                      <label tabIndex={0} className="">
                        <summary className="list-none p-3 cursor-pointer ">
                          <img src={More} alt="More" />
                        </summary>
                      </label>
                      <ul
                        tabIndex={0}
                        className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute"
                      >
                        <span className="hover:bg-[#7940CF] hover:rounded">
                          <li
                            onClick={async () => {
                              ChatState.setIsLoading(true);
                              await blockUserCall(profile.id).then((res) => {
                                ChatState.setIsLoading(false);
                                if (
                                  res?.status === 200 ||
                                  res?.status === 201
                                ) {
                                  toast.success("User Blocked");
                                  navigate("/chat");
                                } else {
                                  toast.error("Could Not Block User");
                                }
                              });
                            }}
                          >
                            <div>Block</div>
                          </li>
                        </span>
                      </ul>
                    </div>
                  </div>
                )}
              {params.id !== "me" &&
                params.id !== user.id &&
                status === "sent" && (
                  <div className=" flex items-center w-[70%] gap-x-5 h-20 ">
                    <button
                      className={`btn w-5/6 btn-primary text-neutral ${disabled}`}
                      onClick={cancelRequest}
                    >
                      <VscChromeClose />
                      Cancel request
                    </button>
                  </div>
                )}
              {params.id !== "me" &&
                params.id !== user.id &&
                status === "recive" && (
                  <div className=" flex items-center w-[60%] gap-x-5 h-20">
                    <button
                      className={`btn btn-square w-5/6 btn-primary text-neutral ${disabled}`}
                      onClick={acceptRequest}
                    >
                      <VscCheck />
                      <p>Accept</p>
                    </button>
                    <button
                      className={`btn btn-square w-5/6 btn-primary text-neutral ${disabled}`}
                      onClick={rejectRequest}
                    >
                      <VscChromeClose />
                      <p>Reject</p>
                    </button>
                  </div>
                )}
              {params.id !== "me" &&
                params.id !== user.id &&
                status === "friend" && (
                  <div className=" flex items-center w-full gap-x-5 h-20">
                    <button
                      className={`btn btn-primary text-neutral ${disabled}`}
                      onClick={async () => {
                        ChatState.setIsLoading(true);
                        await createNewRoomCall(
                          "",
                          "dm",
                          undefined,
                          params.id,
                        ).then((res) => {
                          ChatState.setIsLoading(false);
                          if (res?.status === 200 || res?.status === 201) {
                            ChatState.changeChatType(ChatType.Chat);
                            ChatState.selectNewChatID(res?.data?.id);
                            ChatState.setCurrentDmUser({
                              secondUserId: profile.id,
                              id: profile.id,
                              name: `${profile.name.first} `,
                              avatar: profile?.picture,
                              bio: profile?.bio,
                            });
                            navigate(`/Dm/${res?.data.id}`);
                          } else {
                            toast.error(
                              "You Can't Send Message To this User For Now, try Again later",
                            );
                          }
                        });
                      }}
                    >
                      <VscComment />
                      Message
                    </button>
                    <div className="dropdown">
                      <label tabIndex={0} className="">
                        <summary className="list-none p-3 cursor-pointer ">
                          <img src={More} alt="More" />
                        </summary>
                      </label>
                      <ul
                        tabIndex={0}
                        className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute"
                      >
                        <li
                          className="hover:bg-[#7940CF] hover:rounded"
                          onClick={() => {
                            socketStore?.socket?.emit(
                              "inviteToGame",
                              {
                                inviterId: user.id,
                                opponentId: profile.id,
                                gameMode: "cassic",
                              },
                              (data: {
                                error: string | null;
                                gameId: string;
                              }) => {
                                if (data.error) {
                                  toast.error(data.error);
                                  return;
                                }
                                user.setGameWaitingId(data.gameId);
                                inviteWaitingModalRef.current?.showModal();
                              },
                            );
                          }}
                        >
                          <span>Invite to a classic game</span>
                        </li>
                        <li
                          className="hover:bg-[#7940CF] hover:rounded"
                          onClick={() => {
                            socketStore?.socket?.emit(
                              "inviteToGame",
                              {
                                inviterId: user.id,
                                opponentId: profile.id,
                                gameMode: "extra",
                              },
                              (data: {
                                error: string | null;
                                gameId: string;
                              }) => {
                                if (data.error) {
                                  toast.error(data.error);
                                  return;
                                }
                                user.setGameWaitingId(data.gameId);
                                inviteWaitingModalRef.current?.showModal();
                              },
                            );
                          }}
                        >
                          <span>Invite to a custom game</span>
                        </li>
                        <span className="hover:bg-[#7940CF] hover:rounded">
                          <li
                            onClick={async () => {
                              ChatState.setIsLoading(true);
                              await blockUserCall(profile.id).then((res) => {
                                ChatState.setIsLoading(false);
                                if (
                                  res?.status === 200 ||
                                  res?.status === 201
                                ) {
                                  toast.success("User Blocked");
                                  navigate("/chat");
                                } else {
                                  toast.error("Could Not Block User");
                                }
                              });
                            }}
                          >
                            <div>Block</div>
                          </li>
                        </span>
                        <span className="hover:bg-[#7940CF] hover:rounded">
                          <li
                            onClick={() => {
                              cancelRequest();
                            }}
                          >
                            <div>Unfriend</div>
                          </li>
                        </span>
                      </ul>
                    </div>
                  </div>
                )}
              {(params.id === "me" || params.id === user.id) && (
                <div className=" flex items-center w-[60%] gap-x-5 h-20">
                  <Link to={"/Settings"}>
                    <button
                      className={`btn btn-primary text-neutral ${disabled}`}
                      //  onClick={cancelRequest}
                    >
                      <VscEdit />
                      Edit Profile
                    </button>
                  </Link>
                  <div className="dropdown">
                    <label tabIndex={0} className="">
                      <summary className="list-none p-3 cursor-pointer ">
                        <img src={More} alt="More" />
                      </summary>
                    </label>
                    <ul
                      tabIndex={0}
                      className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 absolute bottom-16  "
                    >
                      <li
                        onClick={() => {
                          LayoutState.setShowBlockedList(
                            !LayoutState.showBlockedLIstModal,
                          );
                        }}
                      >
                        <span className="hover:bg-[#7940CF]">
                          <a href="#my_modal_3" className="pr-2">
                            <div>See Blocked List</div>
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex h-full w-full flex-row gap-x-4 justify-center sm:justify-start items-center  sm:w-auto sm:pr-4 sm:pt-0 pt-4">
            <img
              className={`h-[9vh] sm:h-[11vh] md:h-[12vh] lg:h-[13vh] xl:h-[15vh] 2xl:h-[16vh] ${
                profile?.achievement !== null && profile?.achievement >= 0
                  ? ""
                  : "opacity-30"
              }`}
              src={Newbie}
              alt="newbie badge"
            />
            <img
              className={`h-[9vh] sm:h-[11vh] md:h-[12vh] lg:h-[13vh] xl:h-[15vh] 2xl:h-[16vh] ${
                profile?.achievement !== null && profile?.achievement >= 1
                  ? ""
                  : "opacity-30"
              }`}
              src={Master}
              alt="Master badge"
            />
            <img
              className={`h-[9vh] sm:h-[11vh] md:h-[12vh] lg:h-[13vh] xl:h-[15vh] 2xl:h-[16vh] ${
                profile?.achievement !== null && profile?.achievement >= 2
                  ? ""
                  : "opacity-30"
              }`}
              src={Ultimate}
              alt="Ultimate badge"
            />
          </div>
        </div>
        <div className="relative flex w-[85vw] justify-center h-auto overflow-">
          <History props={params.id} />
        </div>
      </div>
      <InvitationWaiting
        ref={inviteWaitingModalRef}
        oppenent={profile}
        user={user}
      />
    </>
  );
};
