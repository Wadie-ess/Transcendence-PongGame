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
import {
  BlockedUsersModal,
  FriendsListModal,
  ShowLogoModal,
} from "../Chat/Components/RoomChatHelpers";
import { Modal } from "./Assets/Modal";

import { InvitationGame } from "./Assets/Invitationmodale";
import { useGameState } from "../Game/States/GameState";
import { useModalStore } from "../Chat/Controllers/LayoutControllers";
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

export const Layout: FC<PropsWithChildren> = (): JSX.Element => {
  const gameStore = useGameState();
  const user = useUserStore();
  const navigate = useNavigate();
  const socketStore = useSocketStore();
  const invitationGameRef = useRef<HTMLDialogElement>(null);
  const path: string = useCurrentPath();

  const modalState = useModalStore();

  useEffect(() => {
    if (gameStore.end === false && path !== "Game/:id") {
      socketStore.socket?.emit("leave");
      gameStore.setEnd(true)
    }
    return () => {
      socketStore.socket?.off("leave");
    }
    // eslint-disable-next-line
  }, [path])
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

    log();
    socketStore.socket?.on("invitedToGame", (data: any) => {
      user.setGameInvitation(data);
      invitationGameRef.current?.showModal();
    });
    return () => {
      socketStore.socket?.off("invitedToGame");
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
          className={`h-screen max-h-screen ${!user.profileComplet ? "blur-lg" : ""}`}
        >
          <Modal />
          <div className="flex flex-row w-full h-16 min-h-16 bg-base-200">
            <div className="flex justify-start items-center z-50 h-full w-full">
              <ShowLogoModal />
              {modalState.showBlockedListModal && <BlockedUsersModal />}
              {modalState.showFriendsListModal && <FriendsListModal />}
              <Logo className="sm:w-30 w-20" />
            </div>
            <div className="flex items-center  justify-end pr-6 gap-6 h-full w-full">
              <Search />
              <Alert />
              <Avatar picture={`${user?.picture?.medium}`} />
            </div>
          </div>
          <div className="flex bg-base-200 h-[calc(100vh-4rem)]">
            <div className="sm:flex flex-col hidden justify-around items-stretch h-full bg-base-200 md:pt-20 w-20 min-w-[5.5rem] max-w-[6rem]">
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
              className="sm:w-[92vw] xl:w-[95.5vw]  md:w-[93.5vw] w-screen right-0 z-10 h-full bg-accent sm:rounded-tl-2xl overflow-auto no-scrollbar"
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
