import { Logo } from '../Layout/Assets/Logo'
export const Loading = (size:any) =>{
    return (
        <tr><td className={`loading loading-ring loading-${size}`}></td></tr>
      )
}
export const Load = () => {
    return (<div className="relative top-14 left-10 h- loading loading-bars loading-lg "></div>)

}

export const PageLoading = () => {
    const obj = {x:"72",y:"72"}
    return (<Logo {...obj}/>)
}