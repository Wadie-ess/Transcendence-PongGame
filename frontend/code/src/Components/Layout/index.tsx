import { Logo } from "./Assets/Logo";
import { Alert } from "./Assets/Alert";
import { Avatar } from "./Assets/Avatar";
import { Search } from "./Assets/Search";
import { Dash } from "./Assets/Dash";
import { Game } from "./Assets/Game";
import { Message } from "./Assets/Message";
import { Profile } from "./Assets/Profile";
import { Settings } from "./Assets/Settings";
import { Out } from "./Assets/Out";
import { FC, PropsWithChildren, useEffect, useLayoutEffect, useRef } from "react";
import { Outlet } from "react-router";
import { matchRoutes, useLocation } from "react-router-dom";
import { useUserStore } from "../../Stores/stores";
import { useNavigate } from "react-router-dom";
import { FirstLogin } from "../FirstLogin";
import { useSocketStore } from "../Chat/Services/SocketsServices";
import { ShowLogoModal } from "../Chat/Components/RoomChatHelpers";
import { Modal } from "./Assets/Modal";
import { InvitationGame } from "./Assets/Invitationmodale";
import { useGameState } from "../Game/States/GameState";
const routes = [
  { path: "Profile/:id" },
  { path: "Dm/:id" },
  { path: "Settings" },
  { path: "Home" },
  { path: "Chat" },
  { path: "Play" },
  { path: "Pure" },
  { path: "Game/:id" },
];

const useCurrentPath = () => {
  const location = useLocation();
  const [{ route }]: any = matchRoutes(routes, location);
  return route.path;
};

function onConnect() {
  console.log("hello");
}
export const Layout: FC<PropsWithChildren> = (): JSX.Element => {
  const gameStore = useGameState();
  const user = useUserStore();
  const navigate = useNavigate();
  const socketStore = useSocketStore();
  const invitationGameRef = useRef<HTMLDialogElement>(null);
  const path: string = useCurrentPath();
  useEffect(() => {
    console.log(gameStore)
    console.log(`path is saads ${path}`)
    if (gameStore.end === false && path !== "Game/:id")
    {
        socketStore.socket.emit("leave");
        gameStore.setEnd(true)
    }
    return () => {
      socketStore.socket.off("leave");
    }
  },[path])
  useLayoutEffect(() => {
    const log = async () => {
      try {
        await user.login();
      } catch (e: any) {
        if (
          e?.response?.status !== 403 &&
          e?.response?.data?.message !== "Please complete your profile"
        ) {
          navigate("/");
          user.logout();
        }
      }
    };

    socketStore.socket = socketStore.setSocket();
    socketStore.socket.on("connect", onConnect);

    // socketStore.socket.on("message", (msg: any) => {
    //   toast.custom(
    //     (t) =>
    //       (
    //         // eslint-disable-next-line
    //         (t.duration = 450),
    //         (
    //           <div
    //             className={`${
    //               t.visible ? "animate-enter" : "animate-leave"
    //             } max-w-sm w-full transition-opacity ease-in  bg-purple-500 rounded-xl  flex flex-col  relative top-[6vh] p-4`}
    //           >
    //             <div className="flex flex-row justify-between  ">
    //               <div className="  flex flex-row ">
    //                 <img
    //                   alt="avatar"
    //                   className="w-10 h-10 rounded-full"
    //                   src={msg.avatar.medium}
    //                 />
    //                 <div className=" pl-3 flex flex-col items-baseline">
    //                   <p className=" text-white  font-poppins text-base font-semibold leading-5 capitalize">
    //                     message Received
    //                   </p>
    //                   <p className="text-[#2F3F53] font-poppins text-base font-normal text-center max-w-[150px] truncate">
    //                     {msg.content}
    //                   </p>
    //                 </div>
    //               </div>

    //               <div>
    //                 <img
    //                   alt="avatar"
    //                   className=" pb-1 w-6 h-6"
    //                   src={closeWhite}
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         )
    //       ),
    //   );
    // });
    // socketStore.socket.on("notification", (msg: any) => {
    //   console.log("chat id", chatState.currentDmUser.id);
    //   console.log("chat id", chatState.selectedChatID);

    //   console.log("room id", msg.roomId);
    //   if (msg.authorId !== user.id) {
    //     toast.custom(
    //       (t) => (
    //         // eslint-disable-next-line
    //         (t.duration = 450),
    //         (
    //           <div
    //             className={`${
    //               t.visible ? "animate-enter" : "animate-leave"
    //             } max-w-sm w-full transition-opacity ease-in  bg-purple-500 rounded-xl  flex flex-col  relative top-[6vh] p-4`}
    //           >
    //             <div className="flex flex-row justify-between  ">
    //               <div className="  flex flex-row ">
    //                 <img
    //                   alt="avatar"
    //                   className="w-10 h-10 rounded-full"
    //                   src={msg.avatar.medium}
    //                 />
    //                 <div className=" pl-3 flex flex-col items-baseline">
    //                   <p className=" text-white  font-poppins text-base font-semibold leading-5 capitalize">
    //                     message Received
    //                   </p>
    //                   <p className="text-[#2F3F53] font-poppins text-base font-normal text-center max-w-[150px] truncate">
    //                     {msg.content}
    //                   </p>
    //                 </div>
    //               </div>

    //               <div>
    //                 <img
    //                   alt="avatar"
    //                   className=" pb-1 w-6 h-6"
    //                   src={closeWhite}
    //                 />
    //               </div>
    //             </div>
    //           </div>
    //         )
    //       )
    //     );
    //   }
    // });

    log();
    socketStore.socket.on("invitedToGame", (data: any) => {
      console.log("invitedToGame", data);
      user.setGameInvitation(data);
      invitationGameRef.current?.showModal();
    });
    return () => {
      socketStore.socket.off("connect");
      socketStore.socket.off("invitedToGame");
    };
    //eslint-disable-next-line
  }, []);

 

  return (
    <>
      {user.profileComplet === false && user.isLogged ? (
        <FirstLogin />
      ) : (
        <div
          data-theme="mytheme"
          className={`h-screen ${!user.profileComplet ? "blur-lg" : ""}`}
        >
          <Modal />
          <div className=" flex flex-row  w-screen h-[9vh]  bg-base-200">
            <div className="flex justify-start items-center z-50 h-full w-full">
              <ShowLogoModal />
              <Logo className="sm:w-30 w-20" />
            </div>
            <div className="flex items-center  justify-end pr-6 gap-6 h-full w-full">
              <Search />
              <Alert />
              <Avatar picture={`${user?.picture?.medium}`} />
            </div>
          </div>
          <div className="flex bg-base-200">
            <div className="sm:flex flex-col hidden justify-around items-stretch h-[91vh] bg-base-200 md:pt-20 w-20 min-w-[5.5rem] max-w-[6rem]">
              <div className="flex flex-col justify-evenly content-start gap-y-10 pb-44">
                <Dash selected={path === "Home"} className="mx-auto" />
                <Game selected={path === "Play"} className="mx-auto" />
                <Message selected={path === "Chat"} className="mx-auto" />
                <Profile
                  selected={path === "Profile/:id"}
                  className="mx-auto"
                />
                <Settings selected={path === "Settings"} className="mx-auto" />
              </div>
              <div className="flex flex-col justify-start">
                <Out className="mx-auto" />
              </div>
            </div>
            <div className=" h-[8vh] fixed bottom-0 sm:hidden btm-nav bg-base-200 flex justify-end z-50">
              <button className="">
                <Dash selected={path === "Home"} />
              </button>
              <button className="">
                <Game selected={path === "Play"} />
              </button>
              <button className="">
                <Message selected={path === "Chat"} />
              </button>
              <button className="">
                <Profile selected={path === "Profile/:id"} />
              </button>
              <button className="">
                <Settings selected={path === "Settings"} />
              </button>
            </div>
            <div
              className="sm:w-[92vw] xl:w-[95.5vw]  md:w-[93.5vw] w-screen right-0 z-10 h-[84vh] sm:h-[91vh]  bg-accent sm:rounded-tl-2xl overflow-auto no-scrollbar"
              id="scrollTarget"
            >
              <Outlet />
            </div>
          </div>
        </div>
      )}
      <InvitationGame ref={invitationGameRef} />
    </>
  );
};
