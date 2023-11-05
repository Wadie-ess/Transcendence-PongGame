export function classNames(...args: (string | number | boolean | undefined)[]) {
    return args.filter(Boolean).map(String).join(' ');
}

