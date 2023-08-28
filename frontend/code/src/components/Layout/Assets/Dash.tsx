import { Link } from 'react-router-dom'
export const Dash =  () => {
    return (
        <Link to={"/Home"}>
            <div className="h-9 w-9 hover:bg-secondary rounded-xl flex justify-center items-center hover:cursor-pointer">
                <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect  x="4" y="4" width="6" height="7" rx="1" stroke="#BDBDBD" strokeWidth="2" strokeLinejoin="round"/>
                <rect x="4" y="15" width="6" height="5" rx="1" stroke="#BDBDBD" strokeWidth="2" strokeLinejoin="round"/>
                <rect x="14" y="4" width="6" height="5" rx="1" stroke="#BDBDBD" strokeWidth="2" strokeLinejoin="round"/>
                <rect x="14" y="13" width="6" height="7" rx="1" stroke="#BDBDBD" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
            </div>
        </Link>
    )
}