import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import * as z from "zod";

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export async function GET() {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();
        const categories = await Category.find({}).sort({ name: 1 });

        return NextResponse.json(categories);
    } catch (error) {
        console.error("[CATEGORIES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const validatedData = categorySchema.parse(body);

        await dbConnect();

        // Check if exists
        const exists = await Category.findOne({
            $or: [
                { name: validatedData.name },
                { slug: validatedData.slug }
            ]
        });

        if (exists) {
            return new NextResponse("Category or Slug already exists", { status: 400 });
        }

        const category = await Category.create(validatedData);

        return NextResponse.json(category);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.errors[0].message, { status: 400 });
        }
        console.error("[CATEGORIES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
