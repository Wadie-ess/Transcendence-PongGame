import "./style.css";

import { Link } from "react-router-dom";

import { useUserStore } from "../../../Stores/stores";

type AvatarProps = {
  picture: string;
};

export const Avatar = (props: AvatarProps) => {
  const user = useUserStore();

  return (
    <div className="avatar myonline dropdown hover:cursor-pointer">
      <div tabIndex={0} className="w-10 sm:w-12 rounded-full">
        <img alt="profile picture" src={props.picture} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content z-50 right-0 top-14 menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <Link to={"Settings"}>
          <li className="hover:bg-primary hover:rounded-xl transform duration-500">
            <div>Settings</div>
          </li>
        </Link>
        <Link to={`Profile/${user.id}`}>
          <li className="hover:bg-primary hover:rounded-xl transform duration-500">
            <div>Profile</div>
          </li>
        </Link>
        {process.env.REACT_APP_LOGOUT && (
          <Link onClick={() => user.logout()} to={process.env.REACT_APP_LOGOUT}>
            <li className="hover:bg-primary hover:rounded-xl transform duration-500">
              <div>Logout</div>
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};
