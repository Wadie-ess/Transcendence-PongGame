import { useForm, SubmitHandler } from "react-hook-form"
import { useRef, useState } from 'react'
import { Avatar } from "../Settings/assets/Avatar"
import { Edit } from "../Settings/assets/Edit"
import { useUserStore } from "../../Stores/stores"
import api from '../../Api/base'
import { toast } from "react-hot-toast"
type Inputs = {
  Avatar: string;
  firstName : string ;
  lastName : string ; 
  discreption : string;
  email : string;
}
const ERROR_MESSAGES = ["Field is required" , "Require min length of " , "Passed max length of"]

export const UploadAvatar = () => {
  const userStore = useUserStore();
  const [preview , setPreview] = useState<any>(null)
  const inputRef = useRef<any>();
  const {
    register,
    handleSubmit
    } = useForm<Inputs>()
  const onSubmit: SubmitHandler<any> = async(data) => {
    try {
      await api.post("/profile/avatar", preview ,{headers:{"Content-Type":"multipart/form-data"}});
    } catch (error) {
     
    }
    try{
      await api.post("/profile/me",{...data ,finishProfile: true });
      userStore.login();
    }
    catch(e :any){
        toast.error(e.response.data.message)
    }
  }
  const handleError = (errors : any) => {
    console.log(errors)
    if (errors[``]?.type === "required")  toast.error(`s ${ERROR_MESSAGES[0]} `); 
    if (errors[``]?.type === "minLength") toast.error(`s ${ERROR_MESSAGES[1]} 4`);
    if (errors[``]?.type === "maxLength")toast.error(`s ${ERROR_MESSAGES[2]} 50 `);

}
  const handleUploadedFile = (event:any) => {

    const formData = new FormData();
    formData.append("image", event.target.files[0]);
    setPreview(formData);
  };
  const handleClick = () => {
    inputRef?.current?.click();

  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col max-w-[50vw] gap-8 justify-center items-center">
        <div className="relative  pt-6 ">
            <Avatar picture={userStore.picture.medium} />
              <div className="absolute bottom-0 right-0" onClick={handleClick}>
                <Edit />
            </div>
        </div>
        <input type="file" className="hidden" id="picture" {...register("Avatar")} onChange={(e) => {handleUploadedFile(e)}} ref={inputRef}  />
        <input type="text" placeholder="First Name " {...register("firstName",{required: true, maxLength: 50 , minLength:4}) }   className="input input-bordered input-secondary w-full max-w-xs" />
        <input type="text" placeholder="Last Name " {...register("lastName",{required: true, maxLength: 50 , minLength:4})} className="input input-bordered input-secondary w-full max-w-xs" />
        <input type="text" placeholder="Bio" {...register("discreption",{required: true, maxLength: 50 , minLength:4})} className="input input-bordered input-secondary w-full max-w-xs" />
        <input type="text" placeholder="Email " {...register("email")} className="input input-bordered input-secondary w-full max-w-xs" />

        <input className="bg-primary h-12 w-80 rounded-md" type="submit" value="Save" />
      </form>
    </>
  )
}