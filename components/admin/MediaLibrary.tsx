
"use client"

import { useState, useEffect } from "react"
import { Search, Upload, Trash2, Check, Loader2, Image as ImageIcon, ExternalLink, Download } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { IMedia } from "@/models/Media"

interface MediaLibraryProps {
    onSelect?: (item: any) => void
    selectionMode?: boolean
}

interface UploadItem {
    id: string
    file: File
    status: 'pending' | 'uploading' | 'success' | 'error'
    error?: string
}

interface UnsplashImage {
    id: string
    urls: {
        regular: string
        thumb: string
    }
    alt_description: string
    user: {
        name: string
        links: { html: string }
    }
}

export function MediaLibrary({ onSelect, selectionMode = false }: MediaLibraryProps) {
    const [items, setItems] = useState<IMedia[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("library")

    // Unsplash State
    const [unsplashSearch, setUnsplashSearch] = useState("")
    const [unsplashResults, setUnsplashResults] = useState<UnsplashImage[]>([])
    const [isSearchingUnsplash, setIsSearchingUnsplash] = useState(false)
    const [importingId, setImportingId] = useState<string | null>(null)

    // Upload State
    const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([])
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        fetchMedia()
    }, [])

    async function fetchMedia() {
        try {
            const res = await fetch("/api/media")
            if (res.ok) {
                setItems(await res.json())
            }
        } catch (error) {
            console.error("Failed to fetch media", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Unsplash Logic
    async function searchUnsplash() {
        if (!unsplashSearch) return
        setIsSearchingUnsplash(true)
        try {
            const res = await fetch(`/api/media/unsplash?query=${encodeURIComponent(unsplashSearch)}`)
            if (res.ok) {
                const data = await res.json()
                setUnsplashResults(data.results || [])
            }
        } catch (error) {
            console.error("Unsplash search failed", error)
        } finally {
            setIsSearchingUnsplash(false)
        }
    }

    async function importFromUnsplash(img: UnsplashImage) {
        setImportingId(img.id)
        try {
            const res = await fetch("/api/media/unsplash/import", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: img.urls.regular,
                    filename: `unsplash-${img.id}`,
                    altText: img.alt_description || "Unsplash image"
                })
            })

            if (res.ok) {
                const newItem = await res.json()
                setItems(prev => [newItem, ...prev])
                setActiveTab("library")
            }
        } catch (error) {
            console.error("Import failed", error)
        } finally {
            setImportingId(null)
        }
    }

    // Upload Logic
    async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substring(7),
                file,
                status: 'pending' as const
            }))

            setUploadQueue(prev => [...prev, ...newFiles])
            processQueue([...uploadQueue, ...newFiles])
        }
        e.target.value = ""
    }

    async function processQueue(currentQueue: UploadItem[]) {
        if (isUploading) return
        setIsUploading(true)

        const queueCopy = [...currentQueue]
        for (let i = 0; i < queueCopy.length; i++) {
            if (queueCopy[i].status === 'pending') {
                await uploadSingleFile(queueCopy[i])
            }
        }
        setIsUploading(false)
    }

    async function uploadSingleFile(item: UploadItem) {
        setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading' } : i))

        const formData = new FormData()
        formData.append("file", item.file)

        try {
            const res = await fetch("/api/media", {
                method: "POST",
                body: formData,
            })

            if (res.ok) {
                const newItem = await res.json()
                setItems(prev => [newItem, ...prev])
                setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'success' } : i))
            } else {
                setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: "Failed" } : i))
            }
        } catch (error) {
            setUploadQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: "Error" } : i))
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure?")) return
        try {
            const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" })
            if (res.ok) setItems(prev => prev.filter(i => (i as any)._id !== id))
        } catch (error) {
            console.error("Delete failed", error)
        }
    }

    return (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="library">Library</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="unsplash" className="text-primary font-bold">Unsplash</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <TabsContent value="library" className="mt-0 h-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {items.map((item: any) => (
                                <div
                                    key={item._id}
                                    className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border hover:border-primary transition-all cursor-pointer"
                                    onClick={() => onSelect?.(item)}
                                >
                                    <Image src={item.url} alt={item.altText} fill sizes="200px" className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button variant="secondary" size="icon" className="h-8 w-8">
                                            <Check className="h-4 w-4" />
                                        </Button>
                                        {!selectionMode && (
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && !isLoading && (
                                <div className="col-span-full h-40 flex flex-col items-center justify-center text-muted-foreground">
                                    <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
                                    <p>No media found</p>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="mt-0">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 bg-gray-50 mb-8">
                            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
                            <p className="text-sm text-muted-foreground mb-4">Click to select or drag and drop files</p>
                            <Input
                                type="file"
                                className="hidden"
                                id="file-upload"
                                multiple
                                onChange={handleFileSelect}
                            />
                            <Button asChild>
                                <label htmlFor="file-upload" className="cursor-pointer">Select Files</label>
                            </Button>
                        </div>

                        {uploadQueue.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Upload Queue</h4>
                                {uploadQueue.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg bg-white">
                                        <div className="relative h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                                            {item.file.type.startsWith("image/") && (
                                                <Image
                                                    src={URL.createObjectURL(item.file)}
                                                    alt="preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate">{item.file.name}</div>
                                            {item.status === 'uploading' && <Progress value={45} className="h-1 mt-1" />}
                                            {item.status === 'error' && <span className="text-xs text-red-500">{item.error}</span>}
                                        </div>
                                        <div className="flex-shrink-0">
                                            {item.status === 'success' && <Check className="h-5 w-5 text-green-500" />}
                                            {item.status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                                            {item.status === 'pending' && <span className="text-xs text-muted-foreground">Waiting...</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="unsplash" className="mt-0 space-y-6">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search high-quality photos on Unsplash..."
                                value={unsplashSearch}
                                onChange={(e) => setUnsplashSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchUnsplash()}
                            />
                            <Button onClick={searchUnsplash} disabled={isSearchingUnsplash}>
                                {isSearchingUnsplash ? <Loader2 className="animate-spin h-4 w-4" /> : <Search className="h-4 w-4" />}
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {unsplashResults.map((img) => (
                                <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border transition-all">
                                    <Image src={img.urls.thumb} alt={img.alt_description || ""} fill sizes="200px" className="object-cover" />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                                        <div className="text-[10px] text-white/80 mb-2 truncate">by {img.user.name}</div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                className="h-7 flex-1 text-[10px]"
                                                onClick={() => importFromUnsplash(img)}
                                                disabled={importingId === img.id}
                                            >
                                                {importingId === img.id ? (
                                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                ) : (
                                                    <Download className="h-3 w-3 mr-1" />
                                                )}
                                                Import
                                            </Button>
                                            <Button size="icon" variant="outline" className="h-7 w-7 bg-white/10 text-white border-white/20" asChild>
                                                <a href={img.user.links.html} target="_blank" rel="noopener noreferrer">
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
