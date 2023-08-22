import {  Link } from "react-router-dom";
import pingpong from '../images/pingpong.svg'
import {Button} from './Assets/Button'

export const Login =  () =>
{

    return (
      <div className="auth-container overflow-hidden  flex flex-col items-center justify-center h-screen bg-[url(./images/bg.gif)] bg-luxury bg-no-repeat bg-cover bg-center">
      <div className="overlay absolute h-full w-full bg-black opacity-40 z-10"></div>
      <div className="auth-section p-16 absolute top-[25%] sm:top-[30%] xl:top-[35%] z-50 flex flex-col items-center gap-y-20">
          <div className="logo-container flex flex-col justify-center">
              <img  src={pingpong} alt="Logo" />
          </div>
          <Link to="/layout">
              <Button/>
          </Link>
      </div>
  </div>
    );
}
