import { useEffect, useState } from "react"
import api from "../../../Api/base"
import { useDebounce } from "./Search"
export const SearchResults = (props:any) => {
    const [result , setResult] = useState([]);
    useDebounce(async() => {
        try {
            
            const res = await api.get("/users/search",{params:{q:props.query}})
            setResult(res.data)
            console.log(res.data)
        } catch (error) {
        }
        
       
    })
    return (
        <>
         { result.map((item : any) => {
            return (
             <li className="hover:bg-primary hover:rounded-xl transform duration-500">{item?.id}</li>
            )
            }) 
         }
        </>
    )
} 