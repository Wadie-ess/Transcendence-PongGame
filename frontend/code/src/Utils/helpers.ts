import { twMerge } from "tailwind-merge";

export function classNames(...args: (string | number | boolean | undefined)[]) {
  return twMerge(...args.filter(Boolean).map(String));
}
