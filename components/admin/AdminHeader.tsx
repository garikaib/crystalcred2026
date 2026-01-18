"use client"

import { useSession, signOut } from "next-auth/react"
import { Bell, User, ChevronDown, Menu } from "lucide-react"
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
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { SidebarContent } from "./AdminSidebar"

export function AdminHeader() {
    const { data: session } = useSession()

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden text-gray-400 hover:text-gray-600">
                            <Menu size={24} />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-none w-64">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <SheetDescription className="sr-only">
                            Main navigation menu for the admin dashboard
                        </SheetDescription>
                        <div className="bg-slate-900 h-full">
                            <SidebarContent />
                        </div>
                    </SheetContent>
                </Sheet>

                <h1 className="text-xl font-bold text-gray-800 md:hidden">CrystalCred</h1>
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
                        <DropdownMenuItem asChild>
                            <a href="/admin/profile" className="cursor-pointer">Profile</a>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <a href="/admin/settings/security" className="cursor-pointer">Settings</a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <button
                                type="button"
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-red-500 w-full text-left cursor-pointer"
                            >
                                Sign out
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
