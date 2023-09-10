import { FC } from 'react'
import { Button } from './assets/Button'
import { LeaderBoard } from './LeaderBoard'
import { Link } from 'react-router-dom'
import herosvg from './assets/Hero.png'
export const Home : FC = () : JSX.Element =>{

    return (
        <>
       
            <div className="flex flex-col items-center h-screen w-full sm:gap-y-8 gap-y-1">
                <div className='flex justify-center relative items-start pt-6 h-2/6 max-h-48 sm:max-h-96 w-[90vw] sm:h-3/4 sm:w-[85vw]'>
                    <img className='w-full h-full object-cover object-top rounded-3xl' alt='leaderboard hero' src={herosvg} />
                    <Link to={"/Play"}><Button/></Link>
                </div>
                <div className='flex justify-center relative items-start pt-6 h-3/6 w-[90vw] sm:h-3/4 sm:w-[85vw]'>
                    <LeaderBoard/>

                </div>
                
            </div>
        </>

        
    )
}