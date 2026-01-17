import { notFound } from "next/navigation";
import { EditPageForm } from "./edit-page-form";

export default async function EditPageLayout({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return (
        <div className="space-y-8">
            <EditPageForm slug={slug} />
        </div>
    );
}
