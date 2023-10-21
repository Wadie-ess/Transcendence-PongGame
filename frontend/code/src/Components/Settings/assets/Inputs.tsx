import { useSpring, animated } from '@react-spring/web'
import { BsFillCheckCircleFill , BsFillXCircleFill } from 'react-icons/bs'
import { Edit } from './Edit';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../../../Stores/stores'
import toast from 'react-hot-toast';
import api from '../../../Api/base';
interface MyComponentProps {
    name: string;
    data:string;
    payload: string;
  }
  const ERROR_MESSAGES = ["Field is required" , "Require min length of " , "Passed max length of"]

  const postData :any = async(data : any , payload : any) : Promise<string> =>  {
   
    const key = payload; // Replace with your actual payload key
    const value = data[payload]; // Replace with your actual payload value
    
    const ndata = {
      [key]: value,
    };
    
       const res = await api.post("/profile/me",{...ndata})
       console.log(res.data)
     return res.data.message
 
  }
export const Inputs = (props:MyComponentProps) => {
    var payload = props.payload
    const user = useUserStore();
    //eslint-disable-next-line
    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const handleError = (errors : any) => {
        if (errors[`${props.payload}`]?.type === "required")  toast.error(`${props.name} ${ERROR_MESSAGES[0]} `); 
        if (errors[`${props.payload}`]?.type === "minLength") toast.error(`${props.name} ${ERROR_MESSAGES[1]} 4`);
        if (errors[`${props.payload}`]?.type === "maxLength")toast.error(`${props.name} ${ERROR_MESSAGES[2]} 50 `);
    
    }
    const onSubmit = (data : any ) => {
        toast.promise(
                                    
            postData(data, payload),
             {
               
               loading: 'Saving...',
               success: <b>{props.name} saved</b>,
               error: <b>could not save {this}</b>,
               
             },
            {className:"font-poppins font-bold relative top-[6vh] bg-base-100 text-white"}
           )
        switch (props.name)
        {
            case "First name" : user.updateFirstName(data[`${props.payload}`]);
                break;
            case "Last name" : user.updateLastName(data[`${props.payload}`]);
                break;
            case "Email" : user.updateEmail(data[`${props.payload}`]);
                break;
            case "Phone" : user.updatePhone(data[`${props.payload}`]);
                break;
            case "Bio" : user.updateBio(data[`${props.payload}`]);
                break;
        }
        
    };
   
    const [input, setInput] = useState(false)
    const [springs ,api] = useSpring(() => ({
        from: { x: '0%' , opacity:100},

    }))
    const handleNameClick = () =>{
        if (input === false){
            api.start({
            to: {
                x: springs.x.get() === '20%' ? '0' : '20%',
            },

            })
            setInput(true)
        }
        else {
            api.start({
                to: {
                    x: springs.x.get() === '20%' ? '0' : '20%',
                },
    
                })
            setInput(false)
        }
    }

    const handleCancle = () => {
        toast.error("Task cancled",{className:"font-poppins font-bold relative top-[6vh] bg-base-100 text-white"});
        reset()
    }
    return (
        <div className='flex flex-col w-full sm:w-4/6'>
        <h6 className='text-sm flex'> {props.name}</h6>
        <div className="flex items-center h-16">
        <form className='gap-y-2  p-2 flex justify-center items-center'>
                <div className="flex  gap-x-2">
                    <input type="text" className={`h-12 w-full rounded-3xl text-center`} defaultValue={props.data} placeholder={props.payload} {...register(`${props.payload}`, {required: true, maxLength: 50 , minLength:4 , disabled:!input ? true:false})} />  
                   
                </div>
            {!input  && <animated.div 
            style={{
                ...springs,
            }}
            onClick={handleNameClick}
            >
            <Edit/>
            </animated.div>
            }
            {
                input &&  <animated.div 
                    style={{
                        ...springs,
                    }}
                    onClick={handleNameClick}
                    >
                    <div className="flex gap-1 items-center">
                   
                        <BsFillCheckCircleFill onClick={handleSubmit(onSubmit,handleError)}   className='fill-green-400 hover:fill-green-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10' />
                        <BsFillXCircleFill  onClick={handleCancle} className='fill-red-600 hover:fill-red-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10'  />
                    </div>

                </animated.div>
            }
            </form>
            </div>
            </div>
    
    )
}