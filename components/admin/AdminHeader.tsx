"use client"

import { useSession } from "next-auth/react"
import { Bell, Search, User, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AdminHeader() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center gap-4 w-1/3">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search..."
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-gray-600">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </Button>

                <div className="h-8 w-px bg-gray-200 mx-2" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 hover:bg-gray-50 rounded-full h-auto py-1.5 ml-1">
                            <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                <AvatarImage src={session?.user?.image || ""} />
                                <AvatarFallback className="bg-teal-100 text-teal-700">
                                    {session?.user?.name?.[0] || "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-xs hidden md:flex">
                                <span className="font-semibold text-gray-900">{session?.user?.name || "Admin"}</span>
                                <span className="text-gray-500">Administrator</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-400" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500">Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
