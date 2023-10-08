import {  Link } from "react-router-dom";
import './style.css'
import { useUserStore } from "../../../Stores/stores";
export const Avatar = (props:any) =>{
    const user = useUserStore();
    return (
        <div className="avatar myonline dropdown hover:cursor-pointer">
        <div tabIndex={0} className="w-10 sm:w-12 rounded-full">
            <img alt="profile " src={props.picture} />
        </div>
        <ul tabIndex={0} className="dropdown-content z-50 right-0 top-10 menu p-2  shadow bg-base-100 rounded-box w-52">
            <Link to={"Settings"}><li className="hover:bg-primary hover:rounded-xl transform duration-500"><div>Settings</div></li></Link>
            <Link to={"Profile/me"}><li className="hover:bg-primary hover:rounded-xl transform duration-500"><div>Profile</div></li></Link>
            {
                process.env.REACT_APP_LOGOUT &&
                <Link onClick={() => user.auth.logout()} to={process.env.REACT_APP_LOGOUT}> <li className="hover:bg-primary hover:rounded-xl transform duration-500"><div>Logout</div></li></Link>
            }
        </ul>
        </div>
        
           
           
    )
}
