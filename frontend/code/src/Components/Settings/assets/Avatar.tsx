export const Avatar = (props:any) => {
    return (
        <div className="avatar">
        <div className="w-24 rounded-full">
            <img src={props.picture} alt="avatar" />
        </div>
        </div>
    )
}