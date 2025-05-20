import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { useSearchParams} from "react-router-dom"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useQueryString = () => {
  const [searchParams] = useSearchParams()
  const searchParamsObject = Object.fromEntries([...searchParams])
  return searchParamsObject
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
}