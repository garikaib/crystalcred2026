import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Page from "@/models/Page";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { slug } = await params;

        await dbConnect();
        const page = await Page.findOne({ slug });

        if (!page) {
            return new NextResponse("Page not found", { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error("[PAGE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { slug } = await params;

        const body = await req.json();
        await dbConnect();

        const page = await Page.findOneAndUpdate(
            { slug },
            {
                $set: {
                    sections: body.sections,
                    isActive: body.isActive,
                    title: body.title
                }
            },
            { new: true }
        );

        if (!page) {
            return new NextResponse("Page not found", { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error("[PAGE_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
