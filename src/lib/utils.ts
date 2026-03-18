import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Category } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num)
}

export const categoryConfig: Record<Category, { label: string; color: string; bgColor: string }> = {
  FORGOTTEN_SUBSCRIPTION: {
    label: 'Forgotten Subscription',
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  OVERCHARGE: {
    label: 'Overcharge',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  PRICE_DROP: {
    label: 'Price Drop',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  FLIGHT_COMPENSATION: {
    label: 'Flight Compensation',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  BANK_FEE: {
    label: 'Bank Fee',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
}
