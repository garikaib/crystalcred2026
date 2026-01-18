"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, Activity, Zap, TrendingUp, BarChart3 } from "lucide-react"

export function AnalyticsWidget() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch from our new local stats endpoint
                const res = await fetch("/api/admin/analytics/stats")
                if (res.ok) {
                    setData(await res.json())
                }
            } catch (e) {
                console.error("Analytics fetch error", e)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-24 bg-gray-100 rounded-xl" />
                ))}
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Active Users */}
                <Card className="shadow-sm border-none bg-indigo-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-900">Active Now</CardTitle>
                        <Users className="h-4 w-4 text-indigo-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-900">{data.activeUsers}</div>
                        <p className="text-xs text-indigo-600/70 mt-1">Visitors in last 30m</p>
                    </CardContent>
                </Card>

                {/* Page Views 24h */}
                <Card className="shadow-sm border-none bg-blue-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-900">Views (24h)</CardTitle>
                        <Eye className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{data.views24h}</div>
                        <p className="text-xs text-blue-600/70 mt-1">{data.views7d} in last 7 days</p>
                    </CardContent>
                </Card>

                {/* Performance */}
                <Card className="shadow-sm border-none bg-emerald-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-emerald-900">Performance</CardTitle>
                        <Zap className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-medium text-emerald-900">
                                <span>LCP</span>
                                <span>{data.vitals?.LCP || '-'}</span>
                            </div>
                            <div className="flex justify-between text-xs font-medium text-emerald-900">
                                <span>CLS</span>
                                <span>{data.vitals?.CLS || '-'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Content */}
                <Card className="shadow-sm border-none bg-purple-50/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-900">Top Content</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xs text-purple-900 space-y-1">
                            {data.topPages?.slice(0, 2).map((p: any, i: number) => (
                                <div key={i} className="flex justify-between w-full truncate">
                                    <span className="truncate max-w-[120px]">{p.url}</span>
                                    <span className="font-bold">{p.count}</span>
                                </div>
                            ))}
                            {(!data.topPages || data.topPages.length === 0) && (
                                <span>No data yet</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
