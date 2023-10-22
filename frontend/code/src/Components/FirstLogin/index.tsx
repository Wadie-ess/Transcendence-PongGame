
import { UploadAvatar } from "./UploadAvatar";

export const FirstLogin =  () => {
    return (
        <>
        <div className="absolute h-full w-full bg-black opacity-20 z-20"></div>

         <div className="z-30 absolute h-[70vh] opacity-90 rounded-xl w-[50vw] top-1/4 right-1/4 bg-base-100 s shadow-xl border-opacity-20 border-8 shadow-primary border-primary">
           
             <div className="flex flex-col p-10 gap-6 justify-center items-center content-center"> 
               
               <UploadAvatar/>
               </div>
              
               
        </div>
        </>
       
    );
}
