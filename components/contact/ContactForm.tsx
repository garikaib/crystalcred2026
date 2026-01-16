"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Turnstile } from "@/components/ui/turnstile"
import { useState, useCallback } from "react"

// Form Validation Schema
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(8, "Phone number required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            message: "",
        },
    })

    const handleTurnstileVerify = useCallback((token: string) => {
        setTurnstileToken(token)
        setError(null)
    }, [])

    const handleTurnstileExpire = useCallback(() => {
        setTurnstileToken(null)
    }, [])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!turnstileToken) {
            setError("Please complete the security verification")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, turnstileToken }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to send message")
            }

            setIsSubmitted(true)
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center text-green-800">
                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                <p>Thank you for reaching out. We will get back to you shortly.</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="+263 77..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="I'm interested in a 5kVA solar system..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex flex-col gap-4">
                    <Turnstile
                        onVerify={handleTurnstileVerify}
                        onExpire={handleTurnstileExpire}
                    />
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || !turnstileToken}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        "Send Message"
                    )}
                </Button>
            </form>
        </Form>
    )
}
