import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(url: string | undefined | null) {
  if (!url) return ""
  if (url.startsWith("http") || url.startsWith("data:")) return url

  // Ensure the path starts with a single slash
  const cleanPath = url.startsWith("/") ? url : `/${url}`

  // For internal images (Next.js public folder/uploads), 
  // we SHOULD use relative paths so Next.js handles them internally.
  // Absolute URLs for local assets can cause 404s in production 
  // due to DNS loopback or SSL verification issues during image optimization.
  return cleanPath
}

