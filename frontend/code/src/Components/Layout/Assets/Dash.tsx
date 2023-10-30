import { Link } from "react-router-dom";
import { classNames } from "../../../Utils/helpers";

type DashProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
};

export const Dash = ({ selected, className, ...props }: DashProps) => {
  return (
    <Link to={"Home"}>
      <div
        className={classNames(
          "h-9 w-9 hover:bg-secondary rounded-xl flex justify-center items-center hover:cursor-pointer",
          selected && "bg-secondary",
          className
        )}
        {...props}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4"
            width="6"
            height="7"
            rx="1"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="4"
            y="15"
            width="6"
            height="5"
            rx="1"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="14"
            y="4"
            width="6"
            height="5"
            rx="1"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="14"
            y="13"
            width="6"
            height="7"
            rx="1"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};
