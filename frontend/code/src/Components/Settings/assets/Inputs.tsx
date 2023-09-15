import { useSpring, animated } from '@react-spring/web'
import { useState } from 'react'
import { BsFillCheckCircleFill , BsFillXCircleFill } from 'react-icons/bs'
import { Edit } from './Edit';
// import { userContext } from '../../../Context';
import { useForm } from 'react-hook-form';
interface MyComponentProps {
    name: string;
    data:string;
  }
  
export const Inputs = (props:MyComponentProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data : any)=> console.log(data);
    console.log(errors);
    // const {user} :any = useContext(userContext);
    // const [myuser, setMyuser] = useState(user);
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
    return (
        <div className='flex flex-col w-full sm:w-4/6'>
        <h6 className='text-sm flex'> {props.name}</h6>
        <div className="flex items-center h-16">
            <form className='gap-y-2 flex p-2 flex-col' onSubmit={handleSubmit(onSubmit)}>
                <div className="flex  gap-x-2">
                    <input type="text"  className={`h-12 w-full rounded-3xl text-center`} defaultValue={props.data} placeholder={props.data} {...register(props.name, {required: true, maxLength: 40 , minLength:4 , disabled:!input ? true:false})} />  
                </div>
            </form>
        
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
                        <BsFillCheckCircleFill className='fill-green-400 hover:fill-green-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10' />
                        <BsFillXCircleFill className='fill-red-600 hover:fill-red-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10'  />
                    </div>
                </animated.div>
            }
            </div>
            </div>
    
    )
}