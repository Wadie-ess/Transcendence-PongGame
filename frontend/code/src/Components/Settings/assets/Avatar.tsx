export const Avatar = (props:any) => {
    return (
        <div className="avatar">
        <div className="w-16 sm:w-24 xl:w-32 rounded-full">
            <img src={props.picture} alt="avatar" />
        </div>
        </div>
    )
}