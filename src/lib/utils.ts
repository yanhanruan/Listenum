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

export function debounce<T extends (...args: any[]) => void>(
  func: T, wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => void>(
  func: T, limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
}

// generate random number
export const generateRandomNumber = (): string => {
  const digits = Math.floor(Math.random() * 5) + 1; // 1到5位数
  const max = Math.pow(10, digits) - 1;
  const min = digits === 1 ? 1 : Math.pow(10, digits - 1);
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};
