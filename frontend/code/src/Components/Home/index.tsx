import { FC } from 'react'
import { Button } from './assets/Button'
import { LeaderBoard } from './LeaderBoard'
import { Link } from 'react-router-dom'
import herosvg from './assets/Hero.png'
export const Home : FC = () : JSX.Element =>{

    return (
        <>
       
            <div className="flex flex-col items-center h-full w-full sm:gap-y-8 gap-y-1 bg-accent">
                <div className='flex justify-center relative items-start pt-6 h-2/6 max-h-48 sm:max-h-96 w-[90vw] sm:h-3/4 sm:w-[85vw]'>
                    <img className='w-full h-full object-cover object-top rounded-3xl' alt='leaderboard hero' src={herosvg} />
                    <Link to={"/Play"}><Button/></Link>
                    
                        <div className='absolute xl:text-4xl md:text-3xl sm:text-2xl   flex top-[15%] right-2/6 text-neutral font-lexend font-extrabold'>READY TO PLAY A GAME? </div>
                   
                </div>
                <div className='flex justify-center relative items-start pt-6 h-auto w-[90vw] sm:w-[85vw]  overflow-hidden'>
                    <LeaderBoard/>

                </div>
                
            </div>
        </>

        
    )
}