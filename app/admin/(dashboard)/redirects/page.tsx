"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Loader2,
    Plus,
    MoreHorizontal,
    Pencil,
    Trash2,
    ArrowRight,
    Search,
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

const formSchema = z.object({
    source: z.string().min(1, "Source is required").startsWith("/", "Must start with /"),
    destination: z.string().min(1, "Destination is required"),
    type: z.enum(["301", "302"]),
    isActive: z.boolean(),
    ignoreQueryParams: z.boolean(),
})

type Redirect = {
    _id: string
    source: string
    destination: string
    type: 301 | 302
    isActive: boolean
    ignoreQueryParams: boolean
    createdAt: string
}

export default function RedirectsPage() {
    const [redirects, setRedirects] = useState<Redirect[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isOpen, setIsOpen] = useState(false)
    const [editingRedirect, setEditingRedirect] = useState<Redirect | null>(null)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            source: "",
            destination: "",
            type: "301",
            isActive: true,
            ignoreQueryParams: true,
        },
    })

    const fetchRedirects = async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                search,
                limit: "10",
            })
            const res = await fetch(`/api/admin/redirects?${params}`)
            const data = await res.json()
            setRedirects(data.redirects)
            setTotalPages(data.pagination.pages)
        } catch (error) {
            console.error("Failed to fetch redirects", error)
            toast({
                title: "Error",
                description: "Failed to load redirects",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRedirects()
    }, [page, search])

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = editingRedirect
                ? `/api/admin/redirects/${editingRedirect._id}`
                : "/api/admin/redirects"
            const method = editingRedirect ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to save redirect")
            }

            toast({
                title: "Success",
                description: `Redirect ${editingRedirect ? "updated" : "created"} successfully`,
            })
            setIsOpen(false)
            fetchRedirects()
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this redirect?")) return

        try {
            const res = await fetch(`/api/admin/redirects/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Failed to delete")

            toast({
                title: "Success",
                description: "Redirect deleted",
            })
            fetchRedirects()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete redirect",
                variant: "destructive",
            })
        }
    }

    const openEdit = (redirect: Redirect) => {
        setEditingRedirect(redirect)
        form.reset({
            source: redirect.source,
            destination: redirect.destination,
            type: redirect.type.toString() as "301" | "302",
            isActive: redirect.isActive,
            ignoreQueryParams: redirect.ignoreQueryParams,
        })
        setIsOpen(true)
    }

    const openCreate = () => {
        setEditingRedirect(null)
        form.reset({
            source: "",
            destination: "",
            type: "301",
            isActive: true,
            ignoreQueryParams: true,
        })
        setIsOpen(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Redirects</h1>
                <Button onClick={openCreate}>
                    <Plus className="mr-2 h-4 w-4" /> Add Redirect
                </Button>
            </div>

            <div className="flex items-center gap-2 max-w-sm">
                <Search className="h-4 w-4 text-gray-500" />
                <Input
                    placeholder="Search paths..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8"
                />
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Source</TableHead>
                            <TableHead>Destination</TableHead>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead className="w-[100px]">Active</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : redirects.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                                    No redirects found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            redirects.map((redirect) => (
                                <TableRow key={redirect._id}>
                                    <TableCell className="font-mono text-sm">{redirect.source}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        <div className="flex items-center gap-2">
                                            <ArrowRight className="h-3 w-3 text-gray-400" />
                                            {redirect.destination}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded bg-gray-100 text-xs font-medium">
                                            {redirect.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className={`h-2.5 w-2.5 rounded-full ${redirect.isActive ? "bg-green-500" : "bg-gray-300"}`} />
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(redirect)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(redirect._id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingRedirect ? "Edit Redirect" : "Create Redirect"}</DialogTitle>
                        <DialogDescription>
                            Create a rule to redirect traffic from one URL to another.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="source"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Source Path</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/old-url" {...field} />
                                        </FormControl>
                                        <FormDescription>The incoming URL path (must start with /)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destination"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destination Path</FormLabel>
                                        <FormControl>
                                            <Input placeholder="/new-url" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="301">301 (Permanent)</SelectItem>
                                                    <SelectItem value="302">302 (Temporary)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm mt-3">
                                            <div className="space-y-0.5">
                                                <FormLabel>Active</FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">save</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
