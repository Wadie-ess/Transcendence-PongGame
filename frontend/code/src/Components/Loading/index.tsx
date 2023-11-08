import { Logo } from '../Layout/Assets/Logo'
export const Loading = (size:any) =>{
    return (
        <tr><td className={`loading loading-ring loading-${size}`}></td></tr>
      )
}
export const Load = () => {
    return (<div className="relative  loading loading-bars loading-sm "></div>)

}

export const PageLoading = () => {
    const obj = {x:"72",y:"72"}
    return (<Logo {...obj}/>)
}