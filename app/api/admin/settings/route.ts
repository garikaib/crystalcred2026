
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await dbConnect();

        let settings = await SiteSettings.findOne();

        if (!settings) {
            // Seed with defaults defined in the model
            settings = await SiteSettings.create({});
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await auth();
        if (!session) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { contact, socials } = body;

        await dbConnect();

        let settings = await SiteSettings.findOne();

        if (!settings) {
            settings = await SiteSettings.create({ contact, socials });
        } else {
            settings.contact = { ...settings.contact, ...contact };
            settings.socials = { ...settings.socials, ...socials };
            await settings.save();
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("[SETTINGS_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
