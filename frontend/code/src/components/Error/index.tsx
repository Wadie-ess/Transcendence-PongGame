import {Font} from './assest/Font'
export const Error = () =>
{
    return (
        <div className=" flex flex-col bg-black h-screen z-0 w-screen relative ">
            <Font/>
            <div className=" absolute flex z-10 items-center top-0 left-0 bg-contain h-screen w-screen max-w-full justify-center overflow-hidden bg-gif-error bg-no-repeat bg-center"></div>
            <h1 className='relative flex items-center pt-44 sm:pt-56 justify-center text-white text-[3.5vw] z-30 h-full font-lexend '>Page Not Found</h1>
        </div>
    )
}