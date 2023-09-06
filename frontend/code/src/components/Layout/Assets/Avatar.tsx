import avatart from '../images/avatar.jpg'
import {  Link } from "react-router-dom";
import './style.css'
export const Avatar = () =>{
    return (
        <div className="avatar myonline dropdown hover:cursor-pointer">
        <div tabIndex={0} className="w-10 sm:w-12 rounded-full">
            <img alt="profile " src={avatart} />
        </div>
        <ul tabIndex={0} className="dropdown-content z-50 right-0 top-10 menu p-2  shadow bg-base-100 rounded-box w-52">
            <li className="hover:bg-primary hover:rounded-xl transform duration-500"><div>Settings</div></li>
            <Link to={"/Profile"}><li className="hover:bg-primary hover:rounded-xl transform duration-500"><div>Profile</div></li></Link>
        </ul>
        </div>
        
           
           
    )
}
