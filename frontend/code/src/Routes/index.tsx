import { createBrowserRouter, RouterProvider } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => {
      let { Login } = await import("../Components/Login");
      return { Component: Login };
    },
  },
  {
    path: "/",
    lazy: async () => {
      let { Layout } = await import("../Components/Layout");
      return { Component: Layout };
    },
    children: [
      {
        path: "Home",
        // loader : async () => { return await dataLoader()}, it was expermintal it's good for multi compononet fetching but not good for only one because in case of multi  fetch it launches fetch paraller and not waiting  each compononet to laod
        lazy: async () => {
          let { Home } = await import("../Components/Home");
          return { Component: Home };
        },
      },
      {
        path: "Play",
        lazy: async () => {
          let { Play } = await import("../Components/Play");
          return { Component: Play };
        },
      },
      {
        path: "Settings",
        lazy: async () => {
          let { Setting } = await import("../Components/Settings");

          return { Component: Setting };
        },
      },
      {
        path: "FirstLogin",
        lazy: async () => {
          let { FirstLogin } = await import("../Components/FirstLogin");
          return { Component: FirstLogin };
        },
      },
      {
        path: "Profile/:id",
        lazy: async () => {
          let { Profile } = await import("../Components/Profile");
          return { Component: Profile };
        },
      },
      {
        path: "Chat",
        lazy: async () => {
          let { Chat } = await import("../Components/Chat");
          return { Component: Chat };
        },
      },
      {
        path: "Dm/:id",
        lazy: async () => {
          let { UserToUserChat } = await import("../Components/Chat/Components/UserToUserChat");
          return { Component: UserToUserChat };
        },
      },
      {
        path: "Game/:id",
        lazy: async () => {
          let { Game } = await import("../Components/Game")
          return { Component: Game};
        },
      }
    ],
  },
  {
    path: "2fa/validate/:token",
    lazy: async () => {
      let { Validate2Fa } = await import("../Components/Validate2Fa");
      return { Component: Validate2Fa };
    },
  },
  {
    path: "*",
    lazy: async () => {
      let { Error } = await import("../Components/Error");
      return { Component: Error };
    },
  },
]);

export const AllRouters = () => {
  return <RouterProvider router={router} />;
};
