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
import { FC, PropsWithChildren, useEffect, useLayoutEffect} from "react";
import { Outlet } from "react-router";
import { matchRoutes, useLocation } from "react-router-dom";
import { useUserStore } from "../../Stores/stores";
import { useNavigate } from "react-router-dom";
import { FirstLogin } from "../FirstLogin";
import { useSocketStore } from "../Chat/Services/SocketsServices";
import toast from "react-hot-toast";

const routes = [
  { path: "Profile/:id" },
  { path: "Dm/:id" },
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

function onConnect() {
  console.log("hello");
}
export const Layout: FC<PropsWithChildren> = (): JSX.Element => {

  const user = useUserStore();
  const navigate = useNavigate();
  const socketStore = useSocketStore();

  useLayoutEffect(() => {
    const log = async () => {
      try {
        await user.login();
      } 
      catch(e:any){
          if (e?.response?.status !== 403 && e?.response?.data?.message !== "Please complete your profile")
          {
          navigate("/");
          user.logout();
          }
      }
        

    };
    socketStore.socket = socketStore.setSocket();
    socketStore.socket.on("connect", onConnect);
    socketStore.socket.on("message",(msg:any) => {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full transition-opacity ease-in  bg-indigo-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 relative top-[6vh] ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={`${msg.avatar.medium}`}
                  alt="avatar"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className="font-bold font-poppins text-neutral">
                  {msg.Username}
                </p>
                <p className="mt-1 font-medium font-poppins  text-black">
                  {msg.content}
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-neutral hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ))
    })
    log();
    return () => {
      socketStore.socket.off("connect", onConnect);
    };
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
          <div className=" flex flex-row  w-screen h-[9vh]  bg-base-200">
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
            <div className="sm:-ml-4 sm:w-[92vw] xl:w-[95.5vw]  md:w-[93.5vw] w-screen right-0 z-10 h-[84vh] sm:h-[91vh]  bg-accent sm:rounded-tl-2xl overflow-auto no-scrollbar" id='scrollTarget'>
                <Outlet />

            </div>
          </div>
        </div>
      )}
    </>
  );
};
