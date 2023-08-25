import { FC } from 'react'
import {BiSearch} from 'react-icons/bi'
interface scales {
    w:number;
    h:number;
}
export const Search : FC<scales> = (props) : JSX.Element => {
    console.log(props)
    return (
        <div className='hidden sm:flex sm:items-center absolute pr-24 '>
            <input type="text" placeholder="Search" className={`input w-${props.w} mr-4 h-${props.h}`}/>
            <div className='relative right-12 top-0 w-12 '><BiSearch size="1.4em" /></div>
        </div> 
    )
}