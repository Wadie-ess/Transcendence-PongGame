import {  Link } from "react-router-dom";
import pingpong from '../images/pingpong.svg'
import {Button} from './Assets/Button'
import { useUserStore } from "../../Stores/stores";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect } from "react";
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
    const userStore = useUserStore();
    const navigate = useNavigate();
    useLayoutEffect(() => {
        const check = async() => {
        try {
            const loggedin = await userStore.login();
            if (loggedin)
                navigate("/home")
        } catch (error:any) {
            if (error.response && error.response.status === 401) {
                // This is a 401 error; you can choose to handle it silently
                console.log("hit")
              } else {
                // Handle other errors
                console.error(error);
              }
        }
    }
    check()
    // eslint-disable-next-line
    },[])
    return (
        <>
            <div className={`overflow-hidden  flex flex-col items-center justify-center h-screen bg-login bg-luxury bg-no-repeat bg-cover bg-center ${false}`}>
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
