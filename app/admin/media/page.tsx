"use client"

import { MediaLibrary } from "@/components/admin/MediaLibrary"
import { Separator } from "@/components/ui/separator"

export default function MediaPage() {
    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
                    <p className="text-muted-foreground">
                        Manage your images and assets.
                    </p>
                </div>
            </div>
            <Separator />
            <div className="flex-1 border rounded-lg overflow-hidden bg-white shadow-sm h-[calc(100vh-200px)]">
                <MediaLibrary />
            </div>
        </div>
    )
}
