import {Link} from 'react-router-dom'
import { useUserStore } from '../../../Stores/stores'
export const Profile = ({selected} : boolean | any) => {
    const userStore = useUserStore();
    return (
    <Link to={`Profile/${userStore?.id}`}>
        <div className={`h-9 w-9 hover:bg-secondary rounded-xl flex justify-center items-center hover:cursor-pointer ${selected && 'bg-secondary'}`}>
            <svg width="19" height="24" viewBox="0 0 19 24" fill="#BDBDBD" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.3615 15.416C14.4385 15.416 18.723 16.241 18.723 19.4239C18.723 22.608 14.4104 23.4037 9.3615 23.4037C4.28566 23.4037 0 22.5788 0 19.3958C0 16.2117 4.31259 15.416 9.3615 15.416ZM9.3615 0C12.8008 0 15.5565 2.75465 15.5565 6.19152C15.5565 9.6284 12.8008 12.3842 9.3615 12.3842C5.92337 12.3842 3.16654 9.6284 3.16654 6.19152C3.16654 2.75465 5.92337 0 9.3615 0Z" fill="#BDBDBD"/>
            </svg>
        </div>
    </Link>
    )
}