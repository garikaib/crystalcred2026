"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, User, Mail, Shield, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
})

interface ProfileData {
    id: string
    username: string
    email: string
    name: string
    role: string
    createdAt: string
}

export default function ProfilePage() {
    const { data: session } = useSession()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [profile, setProfile] = useState<ProfileData | null>(null)

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
        },
    })

    useEffect(() => {
        async function loadProfile() {
            try {
                const res = await fetch("/api/admin/profile")
                if (res.ok) {
                    const data = await res.json()
                    setProfile(data)
                    form.reset({ username: data.username })
                }
            } catch (error) {
                console.error("Failed to load profile", error)
            } finally {
                setIsLoading(false)
            }
        }
        loadProfile()
    }, [form])

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setIsSaving(true)
        try {
            const res = await fetch("/api/admin/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile")
            }

            setProfile(prev => prev ? { ...prev, username: data.username } : null)
            toast({
                title: "Profile Updated",
                description: "Your username has been updated successfully.",
            })
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to update profile.",
            })
        } finally {
            setIsSaving(false)
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
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 mt-1">Manage your account settings</p>
            </div>

            {/* Profile Info Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-teal-600" />
                        Profile Information
                    </CardTitle>
                    <CardDescription>
                        View and update your account details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Read-only Info */}
                    <div className="grid gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                <p className="font-medium">{profile?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Shield className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Role</p>
                                <p className="font-medium capitalize">{profile?.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                                <p className="font-medium">
                                    {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Editable Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your username" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your unique identifier. Only lowercase letters, numbers, and underscores allowed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                        Manage your password and security settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/admin/settings/security">
                        <Button variant="outline">Change Password</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
