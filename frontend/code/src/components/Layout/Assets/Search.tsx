import {BiSearch} from 'react-icons/bi'

export const Search = () => {
    return (
        <div className='hidden sm:flex sm:items-center absolute pr-24 '>
            <input type="text" placeholder="Search" className={`input w-60 mr-4 h-12`}/>
            <div className='relative right-12 top-0 w-12 '><BiSearch size="1.4em" /></div>
        </div> 
    )
}