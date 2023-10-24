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
import { FC, PropsWithChildren, useLayoutEffect } from "react";
import { Outlet } from "react-router";
import { matchRoutes, useLocation } from "react-router-dom";
import { useUserStore } from "../../Stores/stores";
import { useNavigate } from "react-router-dom";
import { FirstLogin } from "../FirstLogin";
import { AxiosError, type AxiosResponse } from "axios";

const routes = [
  { path: "Profile/:id" },
  { path: "Settings" },
  { path: "Home" },
  { path: "Chat" },
  { path: "Play" },
  { path: "Pure" },
  { path: "Game" },
];


const useCurrentPath = () => {
  const location = useLocation();
  const [{ route }]: any = matchRoutes(routes, location);
  return route.path;
};

export const Layout: FC<PropsWithChildren> = (): JSX.Element => {
  const user = useUserStore();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const log = async () => {
      try {
        await user.login();  
      }
      catch(e){
          navigate("/");
          user.logout();
      }
        

    };
    log();
    //eslint-disable-next-line
  }, []);
  const path: string = useCurrentPath();
  const obj = { x: "30", y: "20" };
  return (
    <>
      {user.profileComplet === false && user.isLogged ? (
        <FirstLogin />
      ) : (
        <div
          data-theme="mytheme"
          className={`h-screen ${!user.profileComplet ? "blur-lg" : ""}`}

        >
          <div className=" flex flex-row  w-screen h-[8vh]  bg-base-200">
            <div className="flex justify-start items-center z-50 pl-1  sm:pl-2  h-full w-full">
              <Logo {...obj} />
            </div>
            <div className="flex items-center  justify-end pr-6 gap-6 h-full w-full">
              <Search />
              <Alert />
              <Avatar picture={`${user?.picture?.medium}`} />
            </div>
          </div>
          <div className="flex bg-base-200">
            <div className="sm:flex flex-col hidden justify-around items-stretch h-[92vh] bg-base-200 overflow-auto md:pt-10 w-20 min-w-[5rem] max-w-[5rem]">
              <div className="flex flex-col justify-evenly content-start gap-y-10 pb-44">
                <Dash selected={path === "Home"} className="mx-auto" />
                <Game selected={path === "Play"} className="mx-auto" />
                <Message selected={path === "Chat"} className="mx-auto" />
                <Profile selected={path === "Profile/:id"} className="mx-auto" />
                <Settings selected={path === "Settings"} />
              </div>
              <div className="flex flex-col justify-start">
                <Out />
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
            <div className="sm:w-[92vw] xl:w-[96vw] md:w-[93.5vw] w-screen right-0 z-10 h-[84vh] sm:h-[92vh] bg-accent sm:rounded-tl-2xl overflow-hidden">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
