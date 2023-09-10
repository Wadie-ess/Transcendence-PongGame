import {  Link } from "react-router-dom";
import pingpong from '../images/pingpong.svg'
import {Button} from './Assets/Button'
import { useEffect, useState } from "react";
import { PageLoading } from "../Loading";
export const Login =  () =>
{
    const [loading , setLoading] = useState<boolean>(true)
    useEffect(() => {
        const sleep =  setTimeout(()=> {setLoading(false)},1000);
        
      
        return () => clearTimeout(sleep);
    },[])
    return (
    <>
        {!loading && (
        <div className={`overflow-hidden  flex flex-col items-center justify-center h-screen bg-login bg-luxury bg-no-repeat bg-cover bg-center`}>
            <div className="absolute h-full w-full bg-black opacity-40 z-10"></div>
            <div className="absolute top-[25%] sm:top-[30%] xl:top-[35%] z-50 flex flex-col items-center gap-y-20">
                <div className=" flex flex-col justify-center">
                    <img  src={pingpong}  alt="Logo" />
                </div>
                <Link to="home">
                    <Button/>
                </Link>
            </div>
        </div>
        )}
        {loading && (<div className="flex justify-center items-center h-screen w-screen">
            <PageLoading/>
            </div>)}
      </>
    );
}
