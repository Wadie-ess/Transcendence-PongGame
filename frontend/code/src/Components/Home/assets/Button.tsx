import './css/style.css'

export const Button = () => {
    return (
        <div  className="mystyle transition duration-500 hover:-translate-y-1 hover:scale-110 ease-in-out hover:cursor-pointer hover:fill-primary flex absolute justify-center items-center left-[36%] sm:left-[41.4%] top-[66%] sm:top-3/4   w-[27vw] sm:w-[17.5vw]">
            <span className=" absolute text-white font-montserrat text-[1.4vw] xl:text-[0.99vw]">PLAY NOW</span>
            <svg width="211" height="57" viewBox="0 0 211 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect className="" x="0.84375" width="209.158" height="57" rx="6" fill="url(#paint0_linear_377_5387)"/>

                <defs>
                <linearGradient id="paint0_linear_377_5387" x1="105.423" y1="0" x2="105.423" y2="57" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7940CF"/>
                <stop offset="1" stopColor="#5921CB"/>
                </linearGradient>
                </defs>
                
            </svg>
            
        </div>
    )
}
