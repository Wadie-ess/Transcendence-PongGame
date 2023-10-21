
import { UploadAvatar } from "./UploadAvatar";
export const FirstLogin =  () => {
    return (
        <>
        <div className="absolute h-full w-full bg-black opacity-40 z-20"></div>

         <div className="z-30 absolute h-[70vh] opacity-90 rounded-3xl w-[50vw] top-1/4 right-1/4 bg-base-100 shadow-2xl shadow-white border-4 border-white">
           
             <div className="flex flex-col p-10 gap-6 justify-center items-center content-center"> 
                <div>
                    Avatar
                </div>
               <UploadAvatar/>
               </div>
              
               
        </div>
        </>
       
    );
}
