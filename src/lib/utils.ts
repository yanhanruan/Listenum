import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomNumber(minDigits: number, maxDigits: number, decimalPlaces: number = 0): number {
  if (minDigits > maxDigits) {
    throw new Error('Minimum digits cannot be greater than maximum digits');
  }
  const min = Math.pow(10, minDigits - 1);
  const max = Math.pow(10, maxDigits) - 1;
  const randomNum = Math.random() * (max - min + 1) + min;
  return decimalPlaces > 0 ? Number(randomNum.toFixed(decimalPlaces)) : Math.floor(randomNum);
}

export function getRandomDate(): Date {
  const start = new Date(1970, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

console.log(getRandomNumber(1,2,3));
console.log(12345);
