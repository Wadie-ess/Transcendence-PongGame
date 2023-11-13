import { useUserStore } from "../../../Stores/stores";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/base";
import { classNames } from "../../../Utils/helpers";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import { useSocketStore } from "../../Chat/Services/SocketsServices";
import { MdOutlineReadMore } from "react-icons/md";

export const Alert = () => {
  const user = useUserStore();
  const navigate = useNavigate();
  const socketStore = useSocketStore();
  const [ref, inView] = useInView();
  const [notificationDone, setNotificationDone] = useState(false);

  const messages: Record<string, string> = useMemo(
    () => ({
      addFriend: "sent you a friend requst",
      acceptFriend: "accepted your friend request",
    }),
    []
  );

  const unread = useMemo(
    () =>
      user.notifications.filter((notification: any) => !notification.is_read)
        .length,
    [user.notifications]
  );

  useEffect(() => {
    socketStore.socket.on("notification", (notification: any) => {
      if (
        notification.actorId === user.id ||
        notification.entity_type === "message"
      ) {
        console.log("notification", notification);
        return;
      }
      user.addNotification(notification);
    });

    return () => {
      socketStore.socket.off("notification");
    };
    //eslint-disable-next-line
  }, [socketStore]);

  useEffect(() => {
    if (inView && !notificationDone) {
      const offset = user.notifications.length;
      const limit = 10;
      api
        .get(`/profile/notifications?offset=${offset}&limit=${limit}`)
        .then((res) => {
          if (res.data.length) {
            user.addNotifications(res.data);
          } else {
            setNotificationDone(true);
          }
        });
    }
    // eslint-disable-next-line
  }, [inView]);

  return (
    <>
      <div className="dropdown">
        <label tabIndex={1} className="relative">
          {unread > 0 && (
            <div className="absolute bg-red-500 bottom-0 -right-2 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white font-light">
              {unread > 9 ? "9+" : unread}
            </div>
          )}
          <svg
            className="flex justify-center items-center w-10 sm:w-12 hover:cursor-pointer"
            width="62"
            height="62"
            viewBox="0 0 62 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="62" height="62" rx="20" fill="black" />
            <path
              d="M27.9189 40.1081C28.5314 39.9785 32.2636 39.9785 32.8761 40.1081C33.3997 40.229 33.966 40.5116 33.966 41.1286C33.9355 41.716 33.5909 42.2367 33.1148 42.5674C32.4974 43.0487 31.7729 43.3535 31.0155 43.4633C30.5966 43.5176 30.185 43.5188 29.7807 43.4633C29.0221 43.3535 28.2976 43.0487 27.6814 42.5662C27.2041 42.2367 26.8594 41.716 26.829 41.1286C26.829 40.5116 27.3952 40.229 27.9189 40.1081ZM30.4698 19C33.0185 19 35.6219 20.2093 37.1684 22.2158C38.1718 23.5078 38.6321 24.7986 38.6321 26.8051V27.327C38.6321 28.8658 39.0388 29.7728 39.9338 30.818C40.6121 31.588 40.8288 32.5765 40.8288 33.6488C40.8288 34.7199 40.4769 35.7367 39.7719 36.5623C38.8488 37.552 37.5471 38.1838 36.2186 38.2936C34.2934 38.4577 32.367 38.5959 30.415 38.5959C28.4618 38.5959 26.5366 38.5132 24.6114 38.2936C23.2817 38.1838 21.98 37.552 21.0582 36.5623C20.3531 35.7367 20 34.7199 20 33.6488C20 32.5765 20.218 31.588 20.895 30.818C21.818 29.7728 22.198 28.8658 22.198 27.327V26.8051C22.198 24.7443 22.7118 23.3967 23.77 22.0776C25.3433 20.1538 27.8652 19 30.3602 19H30.4698Z"
              fill="#8F8F8F"
            />
          </svg>
        </label>
        <div
          tabIndex={1}
          className="dropdown-content z-[60] card card-compact w-80 shadow bg-base-300 text-neutral relative right-0 top-16 overflow-hidden"
        >
          <div className="card-body !p-0 !gap-0">
            <div className="flex flex-row justify-between items-center">
              <h3 className="text-neutral text-xl p-4">Notifications</h3>
              {unread > 0 && (
                <div
                  title="Mark all as read"
                  onClick={() => {
                    user.updateAllNotificationsRead();
                    api.post("/profile/read-all-notifications");
                  }}
                  className="hover:cursor-pointer"
                >
                  <MdOutlineReadMore className="text-2xl mr-4" />{" "}
                </div>
              )}
            </div>
            <ul className="bg-base-100/50 border-t-2 border-violet-800  h-60  overflow-auto">
              {user.notifications.map((notification: any) => (
                <li
                  key={notification.id}
                  className={classNames(
                    "flex flex-row justify-start text-xs gap-3 p-4 hover:cursor-pointer",
                    notification.is_read && "opacity-50"
                  )}
                  onClick={async () => {
                    try {
                      navigate(`/profile/${notification.actorId}`);
                      user.updateNotificationRead(notification.id);
                      await api.post(
                        `/profile/read-notification/${notification.id}`
                      );
                    } catch (error) {
                      toast.error("Something went wrong");
                    }
                  }}
                >
                  <img
                    src={`https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${notification.actor.avatar}`}
                    alt=""
                    className="rounded-full"
                  />
                  <div className="flex items-center flex-col  ">
                    <div className="w-full line-clamp-2">
                      {`${notification.actor.firstName} ${
                        notification.actor.lastName
                      }  ${messages[notification.type]}`}
                    </div>
                    <div className="text-right w-full text-[10px] text-gray-400">
                      {new Date(notification.createdAt).toDateString()}
                    </div>
                  </div>
                </li>
              ))}
              <div
                ref={ref}
                className="flex justify-center items-center h-2 py-5 border-t border-gray-700
								"
              >
                <span className="text-xs text-gray-400">
                  {notificationDone ? "No more notifications" : "Loading..."}
                </span>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
