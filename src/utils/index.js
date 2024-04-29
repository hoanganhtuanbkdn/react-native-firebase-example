import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function randomNumber(max) {
  return Math.floor(Math.random() * max) + 1;
}
export function formatNumber(number) {
  if (number < 10) {
    return 10;
  } else if (number > 100) {
    return 100;
  } else {
    return number;
  }
}
