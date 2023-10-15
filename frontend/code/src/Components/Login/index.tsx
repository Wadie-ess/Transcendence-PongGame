import {  Link } from "react-router-dom";
import pingpong from '../images/pingpong.svg'
import {Button} from './Assets/Button'
// import { PageLoading } from '../Loading';
// const FallBackLoading = () => {
//   return (
//     <div className="flex justify-center items-center h-screen w-screen">
//           <PageLoading/>
//       </div>
//   )
// }
export const Login =  () =>
{
   
    return (
        <>
            <div className={`overflow-hidden  flex flex-col items-center justify-center h-screen bg-login bg-luxury bg-no-repeat bg-cover bg-center`}>
                <div className="absolute h-full w-full bg-black opacity-40 z-10"></div>
                <div className="absolute top-[25%] sm:top-[30%] xl:top-[35%] z-50 flex flex-col items-center gap-y-20">
                    <div className=" flex flex-col justify-center">
                        <img  src={pingpong}  alt="Logo" />
                    </div>
                    {
                        process.env.REACT_APP_AUTH_PATH && 
                        <Link to={process.env.REACT_APP_AUTH_PATH}>
                            <Button/>
                        </Link>
                    }
                </div>
            </div>
           
       </>
    );
}
