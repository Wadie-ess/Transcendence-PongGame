import { createBrowserRouter  , RouterProvider } from "react-router-dom";
import { Login } from "../components/Login";
const router = createBrowserRouter([
    {
        path:"/",
        element:<Login/>, 
    },
    {
        path:"/Home",
        lazy: async () => {let { Home } = await import("../components/Home")
        return { Component: Home }},  
    },
    {
        path:"/Play",
        lazy: async () => {let { Play } = await import("../components/Play")
        return { Component: Play }},  
    },
    {
        path:"/Settings",
        lazy: async () => {let { Setting } = await import("../components/Settings")
    
        return { Component: Setting }},  
    },
    {
        path:"/Lobby",
        lazy: async () => {let { Lobby } = await import("../components/Lobby/index")
        return { Component: Lobby }},  
    },
    {
        path:"/Profile/:id",
        lazy: async () => {let { Profile } = await import("../components/Profile")
        return { Component: Profile }},  
    },
    {
        path:"*",
        lazy: async () => {let { Error } = await import("../components/404/")
        return { Component: Error }},  
    },
])

export const AllRouters = () => {
    return (
        <RouterProvider router={router} />
    )
}