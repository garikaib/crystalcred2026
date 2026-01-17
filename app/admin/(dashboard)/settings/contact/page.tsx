"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

import { logActivityAction } from "@/app/actions/log-activity";

// Helper schema for social links (URL, empty string, or #)
const socialLinkSchema = z.union([
    z.string().url("Invalid URL"),
    z.literal("#"),
    z.literal("")
]).optional();

const contactSchema = z.object({
    contact: z.object({
        address: z.string().min(1, "Address is required"),
        phone: z.string().min(1, "Phone is required"),
        email: z.string().email("Invalid email address"),
        whatsapp: socialLinkSchema,
    }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            contact: { address: "", phone: "", email: "", whatsapp: "" },
        },
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (!res.ok) throw new Error("Failed to fetch settings");
                const data = await res.json();

                form.reset({
                    contact: {
                        address: data.contact?.address || "",
                        phone: data.contact?.phone || "",
                        email: data.contact?.email || "",
                        whatsapp: data.contact?.whatsapp || "",
                    },
                });
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Could not load settings.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [form, toast]); // Added toast to deps

    const onSubmit = async (data: ContactFormValues) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data), // Sending minimal update, API merges deep
            });

            if (!res.ok) throw new Error("Failed to update settings");

            toast({
                title: "Contact Info Saved",
                description: "Your contact details have been updated successfully.",
            })

            logActivityAction("updated_contact_settings", "Updated contact information")
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message || "Failed to update settings.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const onErrors = (errors: any) => {
        console.error("Form errors:", errors);
        toast({
            title: "Validation Error",
            description: "Please check the form for errors.",
            variant: "destructive",
        });
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Contact Information</h1>
                <p className="text-gray-500 mt-1">Manage contact details displayed on the site.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onErrors)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Details</CardTitle>
                            <CardDescription>
                                These details will appear in the footer and contact page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="contact.address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Physical Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="contact.email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="contact.phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="contact.whatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp Link</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="https://wa.me/..." />
                                        </FormControl>
                                        <FormDescription>
                                            Full URL to WhatsApp (e.g., https://wa.me/263...)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" size="lg" disabled={saving} className="w-full md:w-auto">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
