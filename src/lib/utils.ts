import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats price in INR with 2 decimal places */
export function formatPrice(amount: number): string {
  return `₹${Number(amount).toFixed(2)}`
}
