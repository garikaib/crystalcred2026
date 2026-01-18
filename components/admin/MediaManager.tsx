"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MediaLibrary } from "./MediaLibrary"

interface MediaManagerProps {
    onSelect: (item: any) => void
    trigger?: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function MediaManager({ onSelect, trigger, open, onOpenChange }: MediaManagerProps) {
    const [internalOpen, setInternalOpen] = useState(false)

    const isOpen = open !== undefined ? open : internalOpen
    const setIsOpen = onOpenChange || setInternalOpen

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            )}
            <DialogContent className="!w-[90vw] !max-w-[90vw] max-h-[85vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Media Manager</DialogTitle>
                    <DialogDescription className="hidden">Browse and manage your media files.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <MediaLibrary
                        selectionMode={true}
                        onSelect={(item) => {
                            onSelect(item)
                            setIsOpen(false)
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
