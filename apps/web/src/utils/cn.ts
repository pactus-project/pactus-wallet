import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function cn(...classNames) {
  return twMerge(clsx(...classNames));
}
