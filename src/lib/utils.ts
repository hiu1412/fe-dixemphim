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
