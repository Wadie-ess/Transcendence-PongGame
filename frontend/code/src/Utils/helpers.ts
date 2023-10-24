export function classNames(...args: (string | number | boolean)[]) {
    return args.filter(Boolean).map(String).join(' ');
}

