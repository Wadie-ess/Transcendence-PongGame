import logo from './images/logo.svg'

export const Layout =  () =>
{
    return (
    <div className='h-screen bg-base-200'>
        <div className= " flex h-18 bg-base-100">
            <img src={logo} alt="logo" className='p-3 w-24 '></img>
        </div>
        <div className='h-screen bg-base-100 w-20 '>
        </div>
    </div>
    )
}