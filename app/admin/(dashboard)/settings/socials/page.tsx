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

// Helper schema for social links (URL, empty string, or #)
const socialLinkSchema = z.union([
    z.string().url("Invalid URL"),
    z.literal("#"),
    z.literal("")
]).optional();

const socialsSchema = z.object({
    socials: z.object({
        facebook: socialLinkSchema,
        twitter: socialLinkSchema,
        instagram: socialLinkSchema,
        linkedin: socialLinkSchema,
        youtube: socialLinkSchema,
        tiktok: socialLinkSchema,
    }),
});

type SocialsFormValues = z.infer<typeof socialsSchema>;

export default function SocialsSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const form = useForm<SocialsFormValues>({
        resolver: zodResolver(socialsSchema),
        defaultValues: {
            socials: { facebook: "", twitter: "", instagram: "", linkedin: "", youtube: "", tiktok: "" },
        },
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/admin/settings");
                if (!res.ok) throw new Error("Failed to fetch settings");
                const data = await res.json();

                form.reset({
                    socials: {
                        facebook: data.socials?.facebook || "",
                        twitter: data.socials?.twitter || "",
                        instagram: data.socials?.instagram || "",
                        linkedin: data.socials?.linkedin || "",
                        youtube: data.socials?.youtube || "",
                        tiktok: data.socials?.tiktok || "",
                    }
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
    }, [form, toast]);

    const onSubmit = async (data: SocialsFormValues) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update settings");

            toast({
                title: "Success",
                description: "Social media links updated successfully.",
            });
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
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Social Media</h1>
                <p className="text-gray-500 mt-1">Manage links to your social media profiles.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onErrors)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Media Links</CardTitle>
                            <CardDescription>
                                Leave a field empty to hide the icon from the site.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="socials.facebook"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Facebook</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://facebook.com/..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.instagram"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Instagram</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://instagram.com/..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.twitter"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Twitter (X)</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://twitter.com/..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.linkedin"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>LinkedIn</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://linkedin.com/in/..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.youtube"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>YouTube</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://youtube.com/..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="socials.tiktok"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>TikTok</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="https://tiktok.com/..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
