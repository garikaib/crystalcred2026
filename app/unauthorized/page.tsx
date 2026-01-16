import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                    You don't have permission to access the admin area.
                    This section is restricted to authorized administrators only.
                </p>
                <Button asChild>
                    <Link href="/">Return to Homepage</Link>
                </Button>
            </div>
        </div>
    )
}
