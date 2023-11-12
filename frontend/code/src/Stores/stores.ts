import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../Api/base";
export type State = {
  isLogged: boolean;
  id: string;
  bio: string;
  phone: string;
  name: {
    first: string;
    last: string;
  };
  picture: {
    thumbnail: string;
    medium: string;
    large: string;
  };
  email: string;
  tfa: boolean;
  friendListIds: string[];
  banListIds: string[];
  achivments: number[];
  dmsIds: string[];
  profileComplet: boolean;
  history:
    | [
        {
          winnerId: string;
          loserId: string;
          score: number;
        },
      ]
    | [];
  chatRoomsJoinedIds:
    | [
        {
          id: number;
          isAdmin: boolean;
          isOwner: boolean;
        },
      ]
    | [];

  notifications: any;
};

type Action = {
  login: () => Promise<boolean>;
  logout: () => void;
  fetchNotifications: (offset: number, limit: number) => Promise<any>;

  toggleTfa: () => void;
  updateFirstName: (firstName: State["name"]["first"]) => void;
  updateLastName: (lastName: State["name"]["last"]) => void;
  updateEmail: (email: State["email"]) => void;
  updatePhone: (phone: State["phone"]) => void;
  updateBio: (bio: State["bio"]) => void;
  setAvatar: (picture: State["picture"]) => void;
  updateNotificationRead: (notificationId: string) => void;
  addNotification: (notification: any) => void;
  addNotifications: (notifications: any) => void;
  updateAllNotificationsRead: () => void;
};

export const useUserStore = create<State & Action>()(
  persist(
    (set, get) => ({
      isLogged: false,
      id: "",
      bio: "",
      phone: "",
      name: {
        first: "",
        last: "",
      },
      picture: {
        thumbnail: "",
        medium: "",
        large: "",
      },
      email: "",
      tfa: false,
      friendListIds: [],
      banListIds: [],
      achivments: [],
      dmsIds: [],
      history: [],
      chatRoomsJoinedIds: [],
      profileComplet: false,
      notifications: [],
      toggleTfa: () => set(({ tfa }) => ({ tfa: !tfa })),
      updateFirstName: (firstName) =>
        set((state) => ({
          name: {
            ...state.name,
            first: firstName,
          },
        })),
      updateLastName: (lastName: string) =>
        set((state) => ({
          name: {
            ...state.name,
            last: lastName,
          },
        })),
      updateEmail: (email: string) =>
        set(() => ({
          email: email,
        })),
      updateNotificationRead: (notificationId: string) => {
        const state = get();
        const notifications = state.notifications.map((notification: any) => {
          if (notification.id === notificationId) {
            notification.is_read = true;
          }
          return notification;
        });
        set({ notifications });
      },
      addNotification: (notification: any) => {
        const state = get();
        const notifications = [notification, ...state.notifications];
        set({ notifications });
      },
      addNotifications: (notifications: any) => {
        const state = get();
        const newNotifications = [...state.notifications, ...notifications];
        set({ notifications: newNotifications });
      },
      updateAllNotificationsRead: () => {
        const state = get();
        const notifications = state.notifications.map((notification: any) => {
          notification.is_read = true;
          return notification;
        });
        set({ notifications });
      },

      updatePhone: (phone: State["phone"]) => set(() => ({ phone: phone })),
      updateBio: (bio: State["bio"]) => set(() => ({ bio: bio })),
      setAvatar: (picture: State["picture"]) =>
        set(() => ({ picture: picture })),
      login: async () => {
        const res = await api.get("/profile/me");
        var user_data = res.data;
        // user_data.picture= null
        const check = user_data.picture.large.split`/`;
        if (check[check.length - 1] === "null") user_data.picture = null;
        const userInitialValue: State = {
          isLogged: true,
          id: user_data.id,
          bio: user_data?.bio ?? "default bio",

          phone: user_data.cell,
          name: {
            first: user_data.name.first,
            last: user_data.name.last,
          },
          picture: {
            thumbnail:
              user_data?.picture?.thumbnail ??
              `https://ui-avatars.com/api/?name=${user_data.name.first}-${user_data.name.last}&background=7940CF&color=fff`,
            medium:
              user_data?.picture?.medium ??
              `https://ui-avatars.com/api/?name=${user_data.name.first}-${user_data.name.last}&background=7940CF&color=fff`,
            large:
              user_data?.picture?.large ??
              `https://ui-avatars.com/api/?name=${user_data.name.first}-${user_data.name.last}&background=7940CF&color=fff`,
          },

          email: user_data.email,
          tfa: user_data.tfa,
          friendListIds: [],
          banListIds: [],
          achivments: [],
          dmsIds: [],
          history: [],
          chatRoomsJoinedIds: [],
          profileComplet: user_data.profileFinished,
          notifications: [],
        };
        // console.log(userInitialValue)
        const state = get();
        const notifications = await state.fetchNotifications(0, 20);
        console.log("notifications:", notifications);
        set({ ...userInitialValue, notifications });
        return userInitialValue.isLogged;
      },
      logout: () => {
        set({}, true);
      },

      fetchNotifications: async (offset: number, limit: number) => {
        const response = await api.get(
          `/profile/notifications/?offset=${offset}&limit=${limit}`,
          { params: { offset, limit } },
        );

        return response.data;
      },
    }),
    {
      name: "userStore",
      storage: createJSONStorage(() => localStorage) as any,
    },
  ),
);
