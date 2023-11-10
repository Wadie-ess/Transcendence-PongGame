import { Logo } from "../Layout/Assets/Logo";
export const Loading = (size: any) => {
  return (
    <tr>
      <td className={`loading loading-ring loading-${size}`}></td>
    </tr>
  );
};
export const Load = () => {
  return <div className="relative  loading loading-bars loading-sm "></div>;
};

export const PageLoading = () => {
  return <Logo className="sm:w-72 w-72" />;
};
