import type { HTMLAttributes } from "react";

type DiamondProps = HTMLAttributes<HTMLOrSVGElement>;

export const Daimond = (props: DiamondProps) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 17L1.6797 7.84963C1.34718 7.43398 1.18092 7.22615 1.13625 6.9757C1.09159 6.72524 1.17575 6.47276 1.34407 5.96778L2.0883 3.73509C2.52832 2.41505 2.74832 1.75503 3.2721 1.37752C3.79587 1 4.49159 1 5.88304 1H12.117C13.5084 1 14.2041 1 14.7279 1.37752C15.2517 1.75503 15.4717 2.41505 15.9117 3.73509L16.6559 5.96778C16.8243 6.47276 16.9084 6.72524 16.8637 6.9757C16.8191 7.22615 16.6528 7.43398 16.3203 7.84963L9 17ZM9 17L12.5 6M9 17L5.5 6M16.5 7L12.5 6M12.5 6L11 2M12.5 6H5.5M7 2L5.5 6M5.5 6L1.5 7"
        stroke="#F2F2F2"
        strokeLinecap="round"
      />
    </svg>
  );
};
