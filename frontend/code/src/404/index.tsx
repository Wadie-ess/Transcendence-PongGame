import {Font} from './assest/Font'
export const Error = () =>
{
    return (
        <div className=" flex flex-col bg-black h-screen z-0 w-screen relative">
            <Font/>
            <div className=" absolute flex z-10 items-center top-1/4 left-1/4  h-1/2 w-1/2 justify-center auth-container overflow-hidden bg-[url(./images/Error.gif)] bg-luxury bg-no-repeat bg-cover bg-center"></div>
            <h1 className='absolute text-white text-3xl z-30 font-lexend top-[64%] left-[39%]'>Page Not Found</h1>
        </div>
    )
}