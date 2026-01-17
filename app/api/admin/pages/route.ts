import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET() {
    try {
        const session = await auth();

        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();

        const pages = await Page.find({}).select("title slug updatedAt isActive").sort({ title: 1 });

        return NextResponse.json(pages);
    } catch (error) {
        console.error("[PAGES_GET] Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
