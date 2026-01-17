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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Image as ImageIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaManager } from "@/components/admin/MediaManager";
import Image from "next/image";

// --- Page Specific Schemas & Components ---

// 1. ABOUT PAGE
const aboutPageSchema = z.object({
    title: z.string().min(1, "Title is required"),
    isActive: z.boolean(),
    sections: z.object({
        hero: z.object({
            badge: z.string(),
            title: z.string(),
            description: z.string(),
        }),
        story: z.object({
            image: z.string(),
            overlayTitle: z.string(),
            overlaySubtitle: z.string(),
            sectionTitle: z.string(),
            mainHeading: z.string(),
            paragraph1: z.string(),
            paragraph2: z.string(),
            stats: z.object({
                experience: z.string(),
                experienceLabel: z.string(),
                success: z.string(),
                successLabel: z.string(),
            }),
        }),
        values: z.object({
            heading: z.string(),
            subheading: z.string(),
            items: z.array(z.object({
                title: z.string(),
                description: z.string(),
                icon: z.string(),
            })),
        }),
        missionVision: z.object({
            mission: z.object({
                title: z.string(),
                description: z.string(),
            }),
            vision: z.object({
                title: z.string(),
                description: z.string(),
            }),
        }),
    }),
});

type AboutFormValues = z.infer<typeof aboutPageSchema>;

function AboutPageEditor({ initialData, onSubmit, saving }: { initialData: any, onSubmit: (data: AboutFormValues) => void, saving: boolean }) {
    const [mediaManagerOpen, setMediaManagerOpen] = useState(false);

    const form = useForm<AboutFormValues>({
        resolver: zodResolver(aboutPageSchema),
        defaultValues: {
            title: initialData.title || "",
            isActive: initialData.isActive ?? true,
            sections: initialData.sections || {
                hero: { badge: "", title: "", description: "" },
                story: {
                    image: "", overlayTitle: "", overlaySubtitle: "", sectionTitle: "", mainHeading: "",
                    paragraph1: "", paragraph2: "", stats: { experience: "", experienceLabel: "", success: "", successLabel: "" }
                },
                values: { heading: "", subheading: "", items: [] },
                missionVision: { mission: { title: "", description: "" }, vision: { title: "", description: "" } }
            }
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit 'About Us' Page</h1>
                        <p className="text-gray-500 mt-1">Update the content and images for the About Us page.</p>
                    </div>
                    <Button type="submit" disabled={saving} className="bg-teal-600 hover:bg-teal-700 text-white">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>

                <Tabs defaultValue="hero" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
                        <TabsTrigger value="hero">Hero</TabsTrigger>
                        <TabsTrigger value="story">Story</TabsTrigger>
                        <TabsTrigger value="values">Values</TabsTrigger>
                        <TabsTrigger value="mission">Mission</TabsTrigger>
                    </TabsList>

                    {/* HERO SECTION */}
                    <TabsContent value="hero" className="space-y-4 py-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Hero Section</CardTitle>
                                <CardDescription>Top section of the page.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="sections.hero.badge"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Badge Text</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sections.hero.title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Main Title</FormLabel>
                                            <FormControl><Input {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sections.hero.description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea {...field} className="h-24" /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* STORY SECTION */}
                    <TabsContent value="story" className="space-y-4 py-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Our Story Section</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="sections.story.image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Featured Image</FormLabel>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    {field.value ? (
                                                        <div className="relative aspect-video w-full max-w-md bg-gray-100 rounded-lg overflow-hidden border">
                                                            <Image
                                                                src={field.value}
                                                                alt="Story Image"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="icon"
                                                                className="absolute top-2 right-2 h-6 w-6"
                                                                onClick={() => field.onChange("")}
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50 text-muted-foreground w-full max-w-md">
                                                            <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                                                            <p className="text-xs">No image selected</p>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => setMediaManagerOpen(true)}
                                                        >
                                                            Select Image
                                                        </Button>
                                                        <Input
                                                            {...field}
                                                            placeholder="Or paste URL..."
                                                            className="flex-1 max-w-md font-mono text-xs"
                                                        />
                                                    </div>

                                                    <MediaManager
                                                        open={mediaManagerOpen}
                                                        onOpenChange={setMediaManagerOpen}
                                                        onSelect={(item) => {
                                                            field.onChange(item.url);
                                                        }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription>Select from library or paste a URL.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="sections.story.sectionTitle"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Section Tag</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="sections.story.mainHeading"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Main Heading</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="sections.story.paragraph1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paragraph 1</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="sections.story.paragraph2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Paragraph 2</FormLabel>
                                            <FormControl><Textarea {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                    <FormField control={form.control} name="sections.story.stats.experience" render={({ field }) => (
                                        <FormItem><FormLabel>Exp Stat</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="sections.story.stats.experienceLabel" render={({ field }) => (
                                        <FormItem><FormLabel>Exp Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="sections.story.stats.success" render={({ field }) => (
                                        <FormItem><FormLabel>Success Stat</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="sections.story.stats.successLabel" render={({ field }) => (
                                        <FormItem><FormLabel>Success Label</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* VALUES SECTION */}
                    <TabsContent value="values" className="space-y-4 py-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Core Values</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="sections.values.heading" render={({ field }) => (
                                    <FormItem><FormLabel>Heading</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />
                                <FormField control={form.control} name="sections.values.subheading" render={({ field }) => (
                                    <FormItem><FormLabel>Subheading</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )} />

                                {form.watch("sections.values.items")?.map((_, index) => (
                                    <Card key={index} className="bg-gray-50 border-gray-200">
                                        <CardContent className="pt-6 space-y-3">
                                            <FormField control={form.control} name={`sections.values.items.${index}.title`} render={({ field }) => (
                                                <FormItem><FormLabel>Item {index + 1} Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                            )} />
                                            <FormField control={form.control} name={`sections.values.items.${index}.description`} render={({ field }) => (
                                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>
                                            )} />
                                        </CardContent>
                                    </Card>
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MISSION & VISION */}
                    <TabsContent value="mission" className="space-y-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader><CardTitle>Mission</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="sections.missionVision.mission.title" render={({ field }) => (
                                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="sections.missionVision.mission.description" render={({ field }) => (
                                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="h-32" /></FormControl></FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Vision</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField control={form.control} name="sections.missionVision.vision.title" render={({ field }) => (
                                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                    )} />
                                    <FormField control={form.control} name="sections.missionVision.vision.description" render={({ field }) => (
                                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} className="h-32" /></FormControl></FormItem>
                                    )} />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </form>
        </Form>
    );
}

// --- Main Component ---

export function EditPageForm({ slug }: { slug: string }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageData, setPageData] = useState<any>(null);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!slug) return; // Prevent fetch if slug is undefined

        const fetchPage = async () => {
            try {
                const res = await fetch(`/api/admin/pages/${slug}`);
                if (!res.ok) throw new Error("Failed to fetch page");
                const data = await res.json();
                setPageData(data);
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "Could not load page content.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug, toast]);

    const handleSubmit = async (data: any) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/pages/${slug}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update page");

            toast({
                title: "Success",
                description: "Page content updated successfully.",
            });
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast({
                title: "Error",
                description: error.message || "Failed to update page.",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!pageData) {
        return <div className="p-4 text-red-500">Page data not found.</div>;
    }

    // Router for Page Specific Editors
    if (slug === 'about') {
        return <AboutPageEditor initialData={pageData} onSubmit={handleSubmit} saving={saving} />;
    }

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-semibold text-gray-800">Editor Not Available</h1>
            <p className="text-gray-500 mt-2">
                A specific editor for <span className="font-mono font-medium text-black">{slug}</span> has not been implemented yet.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => router.back()}>
                Go Back
            </Button>
        </div>
    );
}
