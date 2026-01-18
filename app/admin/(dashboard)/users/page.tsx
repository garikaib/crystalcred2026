"use client"

import { useState, useEffect } from "react"
import { Loader2, Users, Key, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface User {
    _id: string
    username: string
    email: string
    role: string
    createdAt: string
}

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function UsersPage() {
    const { data: session, status } = useSession()
    const { toast } = useToast()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])
    const [searchQuery, setSearchQuery] = useState("")

    // Password reset dialog state
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [newPassword, setNewPassword] = useState("")
    const [isResetting, setIsResetting] = useState(false)

    // Protect Page: Only Super Admin (garikaib@gmail.com or garikaib)
    useEffect(() => {
        if (status === "loading") return

        const isSuperAdmin = session?.user?.email === "garikaib@gmail.com" || session?.user?.name === "garikaib"

        if (!session || !isSuperAdmin) {
            router.push("/admin")
            toast({
                variant: "destructive",
                title: "Access Denied",
                description: "You do not have permission to view this page.",
            })
        }
    }, [session, status, router, toast])

    useEffect(() => {
        async function loadUsers() {
            try {
                const res = await fetch("/api/admin/users")
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data)
                }
            } catch (error) {
                console.error("Failed to load users", error)
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load users.",
                })
            } finally {
                setIsLoading(false)
            }
        }
        loadUsers()
    }, [toast])

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    async function handlePasswordReset() {
        if (!selectedUser || !newPassword) return

        setIsResetting(true)
        try {
            const res = await fetch(`/api/admin/users/${selectedUser._id}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newPassword }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password")
            }

            toast({
                title: "Password Reset",
                description: `Password updated for ${selectedUser.username}`,
            })
            setSelectedUser(null)
            setNewPassword("")
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to reset password.",
            })
        } finally {
            setIsResetting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500 mt-1">Manage user accounts</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5 text-teal-600" />
                                All Users
                            </CardTitle>
                            <CardDescription>
                                {users.length} total users
                            </CardDescription>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search users..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                        No users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Key className="h-4 w-4 mr-1" />
                                                Reset Password
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Password Reset Dialog */}
            <Dialog open={!!selectedUser} onOpenChange={() => { setSelectedUser(null); setNewPassword(""); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Set a new password for <strong>{selectedUser?.username}</strong> ({selectedUser?.email})
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            type="password"
                            placeholder="New password (min 10 chars, A-Z, a-z, 0-9, special)"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedUser(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handlePasswordReset}
                            disabled={isResetting || newPassword.length < 10}
                        >
                            {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
