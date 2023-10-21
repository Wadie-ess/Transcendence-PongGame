import {useState , useDeferredValue, ChangeEvent , useEffect} from 'react'
import {BiSearch} from 'react-icons/bi'
import { SearchResults } from './SearchResults'

 export function useDebounce<T>(value: T, delay?: number): T {
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
  const searchQuery = useDeferredValue(searchText);
  const onSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);

    return (
        
        <div className='dropdown hover:cursor-pointer hidden sm:flex sm:items-center absolute pr-24 right-80 '>
            <div tabIndex={0} className="w-10 sm:w-12 rounded-full">
            <input type="text" placeholder="Search" className={`input w-44 h-8 md:w-60 mr-4 md:h-12`} onChange={onSearchTextChange} value={searchQuery}/>
             </div>
             <ul tabIndex={0} className="dropdown-content menu p-2  shadow bg-base-100 rounded-box w-52">

            <div className='relative right-12 top-0 w-12 '><BiSearch size="1.4em" /></div>
            <div className='absolute top-12'>
                <SearchResults query={searchQuery} />
            </div>
            </ul>
        </div> 
    )
}