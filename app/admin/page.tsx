import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, Image as ImageIcon, ArrowUpRight } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { Product } from "@/models/Product"
import { GalleryItem } from "@/models/GalleryItem"

async function getStats() {
    await dbConnect()

    // Parallelize the database calls for performance
    const [postCount, productCount, galleryCount] = await Promise.all([
        BlogPost.countDocuments(),
        Product.countDocuments(),
        GalleryItem.countDocuments(),
    ])

    return {
        postCount,
        productCount,
        galleryCount
    }
}

export default async function AdminDashboard() {
    const { postCount, productCount, galleryCount } = await getStats()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Overview of your system performance.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border shadow-sm text-sm text-gray-500">
                    Data: Real-time
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-none shadow-md bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={120} />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-sm font-medium text-blue-100">Total Blog Posts</CardTitle>
                        <FileText className="text-blue-100" size={18} />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold mb-1">{postCount}</div>
                        <p className="text-xs text-blue-100/80 flex items-center gap-1">
                            Published & Drafts
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-teal-500 to-teal-600 text-white overflow-hidden relative group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package size={120} />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-sm font-medium text-teal-100">Total Products</CardTitle>
                        <Package className="text-teal-100" size={18} />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold mb-1">{productCount}</div>
                        <p className="text-xs text-teal-100/80 flex items-center gap-1">
                            Active Inventory
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md bg-gradient-to-br from-purple-500 to-purple-600 text-white overflow-hidden relative group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ImageIcon size={120} />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
                        <CardTitle className="text-sm font-medium text-purple-100">Gallery Images</CardTitle>
                        <ImageIcon className="text-purple-100" size={18} />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-3xl font-bold mb-1">{galleryCount}</div>
                        <p className="text-xs text-purple-100/80 flex items-center gap-1">
                            Portfolio Items
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <Card className="shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle className="text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-500 text-center py-8">
                            Recent activity logging coming soon.
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm border-gray-100">
                    <CardHeader>
                        <CardTitle className="text-lg">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Database</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">API</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Operational</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-600">Storage</span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Operational</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
