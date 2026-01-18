"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export function PaginationControls({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
}: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
