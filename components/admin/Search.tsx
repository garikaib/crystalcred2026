"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon } from "lucide-react"

export function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", "1")
        if (term) {
            params.set("q", term)
        } else {
            params.delete("q")
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <Input
                className="pl-10 w-full sm:w-[300px]"
                placeholder={placeholder}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get("q")?.toString()}
            />
            <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>
    )
}
