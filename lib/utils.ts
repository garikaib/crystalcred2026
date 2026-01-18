import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | undefined | null) {
  if (!url) return ""
  if (url.startsWith("http") || url.startsWith("data:")) return url

  // Ensure the URL starts with a slash
  const path = url.startsWith("/") ? url : `/${url}`

  // In development or if no base URL is provided, use as is
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""

  // Client-side fallback to ensure absolute URLs if env var misses
  if (typeof window !== 'undefined' && (!baseUrl || baseUrl === "http://localhost:3000")) {
    baseUrl = window.location.origin
  }

  if (!baseUrl || baseUrl === "http://localhost:3000") return path

  return `${baseUrl}${path}`
}

