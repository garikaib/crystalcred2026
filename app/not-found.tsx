"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileQuestion, MoveLeft, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-lg w-full p-8 mx-4"
            >
                <div className="glass rounded-2xl p-8 shadow-premium text-center space-y-8 border border-white/20">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary opacity-20 blur-2xl rounded-full" />
                            <div className="bg-background rounded-2xl p-4 shadow-lg relative">
                                <FileQuestion className="w-16 h-16 text-primary" />
                            </div>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                Page Not Found
                            </span>
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild size="lg" className="gap-2 group">
                            <Link href="/">
                                <Home className="w-4 h-4" />
                                Return Home
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="gap-2">
                            <Link href="/contact">
                                Contact Support
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-8 border-t border-border/50">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-2 cursor-pointer"
                        >
                            <MoveLeft className="w-4 h-4" />
                            Back to previous page
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
