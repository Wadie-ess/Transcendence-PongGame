import { useSpring, animated } from '@react-spring/web'
import { BsFillCheckCircleFill , BsFillXCircleFill } from 'react-icons/bs'
import { Edit } from './Edit';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../../../Stores/stores'
import toast from 'react-hot-toast';

interface MyComponentProps {
    name: string;
    data:string;
  }
  const getdata :any = async(data : any) => {
    const res:any = await fetch("http://localhost:3000")
    return res
}

export const Inputs = (props:MyComponentProps) => {
    const user = useUserStore();
    const { register, handleSubmit, reset } = useForm();
    const onSubmit = (data : any)=> {
        toast.promise(
                                    
            getdata(data),
             {
               
               loading: 'Saving...',
               success: <b>{props.name} saved</b>,
               error: <b>could not save</b>,
               
             },
            {className:"font-poppins font-bold relative top-[6vh] bg-base-100 text-white"}
           )
        console.log(data)
        switch (props.name)
        {
            case "First name" : user.updateFirstName(data["First name"]);
                break;
            case "Last name" : user.updateLastName(data["Last name"]);
                break;
            case "Email" : user.updateEmail(data["Email"]);
                break;
            case "Phone" : user.updatePhone(data["Phone"]);
                break;
            case "Bio" : user.updateBio(data["Bio"]);
                break;
        }
        
        console.log(`user from state after = ${user.name.first}`)
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
                    <input type="text" className={`h-12 w-full rounded-3xl text-center`} defaultValue={props.data} placeholder={props.name} {...register(`${props.name}`, {required: true, maxLength: 40 , minLength:4 , disabled:!input ? true:false})} />  
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
                   
                        <BsFillCheckCircleFill onClick={handleSubmit(onSubmit)}   className='fill-green-400 hover:fill-green-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10' />
                        <BsFillXCircleFill  onClick={handleCancle} className='fill-red-600 hover:fill-red-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10'  />
                    </div>

                </animated.div>
            }
            </form>
            </div>
            </div>
    
    )
}