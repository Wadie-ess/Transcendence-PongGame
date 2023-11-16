import { useForm, SubmitHandler } from "react-hook-form";
import { useUserStore } from "../../Stores/stores";
import api from "../../Api/base";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UploadLogic } from "./UploadLogic";
type Inputs = {
  Avatar: string;
  firstName: string;
  lastName: string;
  discreption: string;
  email: string;
  Username: string;
};
const ERROR_MESSAGES = [
  "Field is required",
  "Require min length of ",
  "Passed max length of",
];
const payload_objects = [
  "firstName",
  "lastName",
  "email",
  "Username",
  "phone",
  "discreption",
];
const data_names = [
  "First name",
  "Last name",
  "Email",
  "Username",
  "Phone",
  "Bio",
];
export const UploadAvatar = () => {
  const userStore = useUserStore();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      toast.promise(api.post("/profile/me", { ...data, finishProfile: true }), {
        loading: "Saving user information",
        success: "Saved successfully",
        error: "Error on Saving Data",
      });
      userStore.login();
      navigate("/Home");
    } catch (e) {}
  };
  const handleError = (errors: any) => {
    // eslint-disable-next-line
    payload_objects.map((item: any, index: number) => {
      if (errors[`${item}`]?.type === "required")
        toast.error(`${data_names[index]} ${ERROR_MESSAGES[0]} `);
      if (errors[`${item}`]?.type === "minLength")
        toast.error(`${data_names[index]} ${ERROR_MESSAGES[1]} 4`);
      if (errors[`${item}`]?.type === "maxLength")
        toast.error(`${data_names[index]} ${ERROR_MESSAGES[2]} 50 `);
      if (errors[`${item}`]?.type === "pattern")
        toast.error(`${errors[`${item}`]?.message}`);
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit, handleError)}
        className="w-full flex flex-col gap-8 justify-center items-center"
      >
        <UploadLogic />
        <input
          type="text"
          placeholder="First Name "
          {...register("firstName", {
            required: true,
            maxLength: 50,
            minLength: 4,
          })}
          defaultValue={userStore.name.first}
          className="input input-bordered input-primary w-full"
        />
        <input
          type="text"
          placeholder="Last Name "
          {...register("lastName", {
            required: true,
            maxLength: 50,
            minLength: 4,
          })}
          defaultValue={userStore.name.last}
          className="input input-bordered input-primary w-full"
        />
        <input
          type="text"
          placeholder="Bio"
          {...register("discreption", {
            required: true,
            maxLength: 50,
            minLength: 4,
          })}
          defaultValue={userStore.bio}
          className="input input-bordered input-primary w-full"
        />
        <input
          type="text"
          placeholder="Username"
          {...register("Username", {
            required: true,
            maxLength: 50,
            minLength: 4,
          })}
          defaultValue={userStore.username}
          className="input input-bordered input-primary w-full"
        />
        <input
          type="text"
          placeholder="Email "
          {...register("email", {
            required: true,
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Entered value does not match email format",
            },
          })}
          defaultValue={userStore.email}
          className="input input-bordered input-primary w-full"
        />

        <input
          className="bg-primary h-12 w-full rounded-md hover:bg-secondary hover:cursor-pointer  transition-colors text-white"
          type="submit"
          value="Save"
        />
      </form>
    </>
  );
};
