import dbConnect from "@/lib/mongodb"
import ActivityLog from "@/models/ActivityLog"
import { auth } from "@/lib/auth"

export async function logActivity(
    action: string,
    description: string,
    metadata?: any
) {
    try {
        await dbConnect()
        const session = await auth()
        const user = session?.user?.email || session?.user?.name || "System"

        await ActivityLog.create({
            action,
            description,
            user,
            metadata,
        })
    } catch (error) {
        console.error("Failed to log activity:", error)
        // We don't want to throw here and break the main flow
    }
}
