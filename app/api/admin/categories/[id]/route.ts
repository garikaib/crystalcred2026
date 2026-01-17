import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import BlogPost from "@/models/BlogPost";
import * as z from "zod";

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const validatedData = categorySchema.parse(body);

        await dbConnect();

        const category = await Category.findById(id);
        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        const oldName = category.name;

        // Check uniqueness if changed
        if (validatedData.name !== oldName || validatedData.slug !== category.slug) {
            const exists = await Category.findOne({
                _id: { $ne: id },
                $or: [
                    { name: validatedData.name },
                    { slug: validatedData.slug }
                ]
            });

            if (exists) {
                return new NextResponse("Category or Slug already exists", { status: 400 });
            }
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            validatedData,
            { new: true }
        );

        // Update all posts using this category name if name changed
        if (validatedData.name !== oldName) {
            await BlogPost.updateMany(
                { category: oldName },
                { category: validatedData.name }
            );
        }

        return NextResponse.json(updatedCategory);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(error.errors[0].message, { status: 400 });
        }
        console.error("[CATEGORY_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || session.user?.role !== "admin") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        const category = await Category.findById(id);
        if (!category) {
            return new NextResponse("Category not found", { status: 404 });
        }

        // Check if any posts are using it
        const postsCount = await BlogPost.countDocuments({ category: category.name });
        if (postsCount > 0) {
            return new NextResponse("Cannot delete category being used by articles", { status: 400 });
        }

        await Category.findByIdAndDelete(id);

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
