import type { FieldErrors, FieldValues } from "react-hook-form";

import { useSpring, animated } from "@react-spring/web";
import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { Edit } from "./Edit";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useUserStore } from "../../../Stores/stores";
import toast from "react-hot-toast";
import api from "../../../Api/base";

import { classNames } from "../../../Utils/helpers";

const postData: any = async (data: any, payload: any): Promise<string> => {
  const key = payload; // Replace with your actual payload key
  const value = data[payload]; // Replace with your actual payload value

  const res = await api.post("/profile/me", { [key]: value });
  return res.data.message;
};

interface InputsProps {
  name: string;
  data: string;
  payload: string;
  // Optional
  className?: string;
  containerClassName?: string;
}

export const Inputs = (props: InputsProps) => {
  const user = useUserStore();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    // Update field on the server
    const toastPromise = toast.promise(
      postData(data, props.payload),
      {
        loading: "Saving...",
        success: <b>{props.name} saved</b>,
        error: <b>could not save {this}</b>,
      },
      {
        className:
          "font-poppins font-bold relative top-[6vh] bg-base-100 text-white",
      }
    );
    // Update field locally after a successful request
    toastPromise.then(() => {
      switch (props.name) {
        case "First name":
          user.updateFirstName(data[`${props.payload}`]);
          break;
        case "Last name":
          user.updateLastName(data[`${props.payload}`]);
          break;
        case "Email":
          user.updateEmail(data[`${props.payload}`]);
          break;
        case "Phone":
          user.updatePhone(data[`${props.payload}`]);
          break;
        case "Bio":
          user.updateBio(data[`${props.payload}`]);
          break;
      }
    });
  };

  const handleError = useCallback((errors: FieldErrors<FieldValues>) => {
    if (errors[props.payload]?.type === "required")
      toast.error(`${props.name} Field is required`);
    if (errors[props.payload]?.type === "minLength")
      toast.error(`${props.name} Require min length of 4`);
    if (errors[props.payload]?.type === "maxLength")
      toast.error(`${props.name} Passed max length of 50`);
    // Additional error for "email" field
    if (props.payload === "email" && errors[props.payload]?.type === "pattern")
      toast.error(`${errors[props.payload]?.message}`);
    // eslint-disable-next-line
  }, []);

  const handleCancel = useCallback(() => {
    toast.error("Task canceled", {
      className:
        "font-poppins font-bold relative top-[6vh] bg-base-100 text-white",
    });
    reset();
    // eslint-disable-next-line
  }, []);

  const [input, setInput] = useState(false);
  const [springs, springsRef] = useSpring(() => ({
    from: { x: "0%", opacity: 100 },
  }));

  const handleNameClick = () => {
    if (input === false) {
      springsRef.start({ to: { x: springs.x.get() === "20%" ? "0%" : "20%" } });
      setInput(true);
    } else {
      springsRef.start({ to: { x: springs.x.get() === "20%" ? "0%" : "20%" } });
      setInput(false);
    }
  };

  return (
    <div className="w-full sm:w-4/6">
      <h6 className="text-sm flex">{props.name}</h6>
      <div className="flex items-center w-full h-16">
        <form
          className={classNames(
            "gap-y-2 p-2 flex justify-center items-center w-full",
            props.className
          )}
        >
          <div className="flex gap-x-2 w-full">
            {props.name === "Email" ? (
              <input
                type="email"
                className={classNames(
                  "h-12 w-full rounded-3xl text-center",
                  props.className
                )}
                defaultValue={props.data}
                placeholder={props.payload}
                {...register(`${props.payload}`, {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid Email format",
                  },
                  maxLength: 50,
                  minLength: 4,
                  disabled: !input ? true : false,
                })}
              />
            ) : (
              <input
                type="text"
                className={classNames(
                  "h-12 w-full rounded-3xl text-center",
                  props.className
                )}
                defaultValue={props.data}
                placeholder={props.payload}
                {...register(`${props.payload}`, {
                  required: true,
                  maxLength: 50,
                  minLength: 4,
                  disabled: !input ? true : false,
                })}
              />
            )}
          </div>
          {!input && (
            <animated.div style={{ ...springs }} onClick={handleNameClick}>
              <Edit />
            </animated.div>
          )}
          {input && (
            <animated.div style={{ ...springs }} onClick={handleNameClick}>
              <div className="flex gap-1 items-center">
                <BsFillCheckCircleFill
                  onClick={handleSubmit(onSubmit, handleError)}
                  className="fill-green-400 hover:fill-green-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10"
                />
                <BsFillXCircleFill
                  onClick={handleCancel}
                  className="fill-red-600 hover:fill-red-700 hover:cursor-pointer h-8 w-8 sm:w-10 sm:h-10"
                />
              </div>
            </animated.div>
          )}
        </form>
      </div>
    </div>
  );
};
