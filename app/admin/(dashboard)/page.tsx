import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, Image as ImageIcon, ArrowUpRight } from "lucide-react"
import dbConnect from "@/lib/mongodb"
import BlogPost from "@/models/BlogPost"
import { Product } from "@/models/Product"
import { GalleryItem } from "@/models/GalleryItem"

import { formatDistanceToNow } from "date-fns"
import ActivityLog from "@/models/ActivityLog"
import Notice from "@/models/Notice"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Archive, CheckCircle2, Info, Bell, Clock } from "lucide-react"
import { AnalyticsWidget } from "@/components/admin/AnalyticsWidget"

async function getStats() {
    await dbConnect()

    // Parallelize the database calls for performance
    const [postCount, productCount, galleryCount, recentActivity, notices] = await Promise.all([
        BlogPost.countDocuments(),
        Product.countDocuments(),
        GalleryItem.countDocuments(),
        ActivityLog.find().sort({ createdAt: -1 }).limit(5).lean(),
        Notice.find({ isActive: true }).sort({ createdAt: -1 }).lean()
    ])

    return {
        postCount,
        productCount,
        galleryCount,
        recentActivity: JSON.parse(JSON.stringify(recentActivity)),
        notices: JSON.parse(JSON.stringify(notices))
    }
}

export default async function AdminDashboard() {
    const { postCount, productCount, galleryCount, recentActivity, notices } = await getStats()

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

            {/* Notices Section */}
            {notices.length > 0 && (
                <div className="space-y-4">
                    {notices.map((notice: any) => (
                        <Alert key={notice._id} variant={notice.type === 'destructive' ? 'destructive' : 'default'} className="bg-white border-l-4 border-l-primary shadow-sm">
                            {notice.type === 'info' && <Info className="h-4 w-4" />}
                            {notice.type === 'warning' && <AlertCircle className="h-4 w-4" />}
                            {notice.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                            {notice.type === 'destructive' && <Bell className="h-4 w-4" />}
                            <AlertTitle>{notice.title}</AlertTitle>
                            <AlertDescription>
                                {notice.content}
                            </AlertDescription>
                        </Alert>
                    ))}
                </div>
            )}

            {/* Analytics Section */}
            <div>
                <AnalyticsWidget />
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
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="w-5 h-5 text-muted-foreground" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentActivity.length > 0 ? (
                            <div className="space-y-6">
                                {recentActivity.map((log: any) => (
                                    <div key={log._id} className="flex gap-4 items-start relative pb-6 last:pb-0 border-l-2 border-slate-100 pl-4 ml-2 last:border-0">
                                        <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-200 ring-4 ring-white"></div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-gray-900 leading-none">
                                                {log.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{log.user}</span>
                                                <span>•</span>
                                                <span title={new Date(log.createdAt).toLocaleString()}>
                                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-8">
                                No recent activity found.
                            </div>
                        )}
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
