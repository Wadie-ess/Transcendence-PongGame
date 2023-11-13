import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../Api/base";
import toast from "react-hot-toast";
import { classNames } from "../../Utils/helpers";

export const Validate2Fa = () => {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [TOTPCode, setTOTPCode] = useState("");
  const navigate = useNavigate();

  console.log(`params : ${params.token} type ${typeof params.token}`);
  useEffect(() => {
    api.get(`/auth/validatToken/${params.token}`).then((res) => {
      if (!res.data)
      {
           navigate("/")
      }
      else
        setIsLoading(false);
    }).catch((Err) => console.log(Err))

    //eslint-disable-next-line
  }, [])
  return (
    <div className={classNames("w-full h-screen flex items-center justify-center", isLoading && "!hidden")}>
      <div className="flex flex-col gap-6 justify-center items-center content-center w-full">
        <div className="flex justify-center items-center gap-x-6">
          <div className="flex flex-col justify-between items-center p-10 h-60 w-60 rounded-2xl border-2 border-violet-600">
            <span className="text-sm font-medium h-8 flex items-center justify-center">
              Verify your device
            </span>
            <div className="w-full h-24 flex flex-col items-center justify-center gap-2">
              <span className="text-sm font-medium">Enter your code</span>
              <input
                type="text"
                placeholder="000000"
                className="w-[70%] text-center border border-violet-600 bg-black rounded tracking-wider leading-none py-0.5"
                maxLength={6}
                onKeyDown={(event) => {
                  if (
                    (event.key >= "0" && event.key <= "9") ||
                    event.key === "Backspace"
                  )
                    return true;
                  event.preventDefault();
                  return false;
                }}
                value={TOTPCode}
                onChange={(event) => {
                  const value = event.target.value;
                  setTOTPCode(value || "");
                }}
              />  
            </div>
            <button
              className="btn bg-gray-200 text-black text-sm hover:btn-primary hover:text-white !h-8 !min-h-0"
              onClick={async () => {
                try {
                  const response = await api.post(
                    "/auth/validate2fa",
                    {
                      otp: TOTPCode,
                      tfaToken: params.token,
                    }
                  );
                  if(response.data)
                    navigate("/Home");  
                  else
                    toast.error("Invalid OTP");
                } catch (e: any) {
                  toast.error(e.response.data.message);
                  console.log(e.response.data.message);
                }
              }}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
