import { useForm, SubmitHandler } from "react-hook-form"


type Inputs = {
  Avatar: string
  AvatarRequired: string
}


export const UploadAvatar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)



  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="file"  {...register("Avatar")} />


      <input {...register("AvatarRequired", { required: true })} />
      {errors.AvatarRequired && <span>This field is required</span>}


      <input type="submit" />
    </form>
  )
}