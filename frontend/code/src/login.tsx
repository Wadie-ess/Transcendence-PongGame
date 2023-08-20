import {GiPingPongBat, GiGlassBall} from 'react-icons/gi'
import {  Link } from "react-router-dom";

export const Login =  () =>
{
    return (
        <div data-thme="luxury"  className="flex flex-col items-center space-y-36 h-[100vh]  bg-[url(./images/bg.gif)] bg-no-repeat bg-cover bg-center ">
        <div className='relative bg-black opacity-40 h-full w-full z-10 flex items-center justify-center'></div>
         <div className='absolute sm:top-[30%] top-[22%] z-50 flex flex-col items-center gap-y-20'>
           <div className='flex flex-col justify-evenly '>
              <h1 className='sm:text-[9rem] text-6xl  text-white flex flex-row items-center gap-x-[1.40rem] sm:gap-x-[3.9rem] font-bold'>P<GiGlassBall className='flex justify-center items-start sm:text-5xl text-3xl text-warning'/>NG</h1>
              <div className='flex flex-row items-center text-6xl sm:text-[9rem] gap-x-2 sm:gap-x-4 text-white font-semibold'>P <GiPingPongBat className='text-warning' />NG</div>
            </div>
            <Link to="/main"><button data-thme="luxury" className="btn btn-success sm:text-3xl text-xl w-40 h-14 font-bold flex  sm:w-80 sm:h-20 z-0"><img alt="42" className='h-8' src="https://profile.intra.42.fr/assets/42_logo-7dfc9110a5319a308863b96bda33cea995046d1731cebb735e41b16255106c12.svg"/> Login</button>
            </Link>
          </div>
        </div>
    );
}