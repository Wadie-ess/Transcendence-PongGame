import {useState , ChangeEvent , useEffect} from 'react'
import {BiSearch} from 'react-icons/bi'
import { SearchResults } from './SearchResults'

function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
    useEffect(() => {
      const timer = setTimeout(() => setDebouncedValue(value), delay || 500)
  
      return () => {
        clearTimeout(timer)
      }
    }, [value, delay])
  
    return debouncedValue
}

export const Search = () => {
  const [searchText, setSearchText] = useState("");
  const DebounceValue = useDebounce(searchText);
  const onSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

    return (
        
        <div className='dropdown hover:cursor-pointer hidden  sm:flex sm:items-center absolute w-80 right-52'>
          
            <input tabIndex={0} type="text" placeholder="Search" className={`input w-80 h-8 md:w-full mr-4 md:h-12`} onChange={onSearchTextChange} onBlur={() => {setSearchText("")}} onFocus={()=>{setSearchText("")}} value={searchText}/>
    
            <div className='relative right-14 top-0 w-12 '><BiSearch size="1.4em" /></div>
             <ul tabIndex={0} className="dropdown-content z-[9999] menu p-2 shadow bg-base-100 rounded-box w-full top-12">
                <SearchResults query={DebounceValue} />
            </ul>
        </div> 
    )
}