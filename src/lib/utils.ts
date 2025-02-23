import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomNumber(minDigits: number, maxDigits: number, decimalPlaces: number = 0): number {
  if (minDigits > maxDigits) throw new Error('Minimum digits cannot be greater than maximum digits');

  const min = 10 ** (minDigits - 1);
  const max = 10 ** maxDigits - 1;
  const num = Math.random() * (max - min + 1) + min;

  if (decimalPlaces) {
    const result = num.toFixed(decimalPlaces);
    return parseFloat(result.endsWith('0') ? result.slice(0, -1) + (Math.floor(Math.random() * 9) + 1) : result);
  }

  return Math.floor(num);
}

export function getRandomDate(): Date {
  const start = new Date(1970, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

