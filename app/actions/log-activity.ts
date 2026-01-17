"use server"

import { logActivity } from "@/lib/logger"

export async function logActivityAction(action: string, description: string, metadata?: any) {
    await logActivity(action, description, metadata)
}
