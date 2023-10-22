import { useEffect, useState } from "react"
import api from "../../../Api/base"
import { Link } from "react-router-dom";
export const SearchResults = (props:any) => {
    const [result , setResult] = useState([]);
    useEffect(() => 
    {
        const search = async() => {
            try {
                const res = await api.get("/users/search",{params:{q:props.query}})
                setResult(res.data)
                console.log(res.data)
            } catch (error) {
            }
        }
        props.query && search()
    },[props.query])
    return (
        <div className="flex flex-col w-full h-full bg-base-100 z-50">
         { result.length >  0 && result.map((item : any , index : number) => {
            return (
                <Link key={index} to={`Profile/${item.id}`}>
                    <li className="hover:bg-primary hover:rounded-xl transform duration-500 h-full w-full z-[10000]">
                        <div className="flex items-center gap-2">
                        <div className="avatar">
                            <div className="w-auto rounded-full gap-4 ring ring-primary ring-offset-base-100 ring-offset-2">
                                <img alt="" src={item.avatar.thumbnail} />
                            </div>
                            </div>
                            <span >{item.name.first} {item.name.last}</span>
                        </div>
                    </li>
                </Link>
            )
            }) 
         }
         {}
        </div>
    )
} 