import { Link } from "react-router-dom";
import { classNames } from "../../../Utils/helpers";

type MessageProps = React.HTMLAttributes<HTMLDivElement> & {
  selected?: boolean;
};

export const Message = ({ selected, className, ...props }: MessageProps) => {
  return (
    <Link to={"Chat"}>
      <div
        className={classNames(
          "h-10 w-10 hover:bg-secondary rounded-xl flex justify-center items-center hover:cursor-pointer",
          selected && "bg-secondary",
          className
        )}
        {...props}
      >
        <svg
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.3259 5.77772C20 6.78661 20 8.19108 20 11C20 13.8089 20 15.2134 19.3259 16.2223C19.034 16.659 18.659 17.034 18.2223 17.3259C17.3409 17.9148 16.1577 17.9892 14 17.9986V18L12.8944 20.2111C12.5259 20.9482 11.4741 20.9482 11.1056 20.2111L10 18V17.9986C7.8423 17.9892 6.65907 17.9148 5.77772 17.3259C5.34096 17.034 4.96596 16.659 4.67412 16.2223C4 15.2134 4 13.8089 4 11C4 8.19108 4 6.78661 4.67412 5.77772C4.96596 5.34096 5.34096 4.96596 5.77772 4.67412C6.78661 4 8.19108 4 11 4H13C15.8089 4 17.2134 4 18.2223 4.67412C18.659 4.96596 19.034 5.34096 19.3259 5.77772Z"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 9L15 9"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 13H12"
            stroke="#BDBDBD"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
};
