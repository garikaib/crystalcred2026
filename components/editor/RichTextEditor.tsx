"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

import { useEffect, useState } from "react";
import {
    Bold,
    Italic,
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { MediaManager } from "@/components/admin/MediaManager";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
    const [mediaOpen, setMediaOpen] = useState(false);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url === null) {
            return;
        }

        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();

            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
            <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                aria-label="Bold"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                aria-label="Italic"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("strike")}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                aria-label="Strike"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("code")}
                onPressedChange={() => editor.chain().focus().toggleCode().run()}
                aria-label="Code"
            >
                <Code className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                aria-label="H1"
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                aria-label="H2"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                aria-label="H3"
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                aria-label="Bullet List"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                aria-label="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                aria-label="Blockquote"
            >
                <Quote className="h-4 w-4" />
            </Toggle>

            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal Rule"
            >
                <Minus className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-1" />

            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={setLink}
                className={cn(editor.isActive("link") && "bg-muted")}
            >
                <LinkIcon className="h-4 w-4" />
            </Button>

            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setMediaOpen(true)}
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
            <MediaManager
                open={mediaOpen}
                onOpenChange={setMediaOpen}
                onSelect={(item) => {
                    editor.chain().focus().setImage({ src: item.url }).run();
                }}
            />

            <div className="ml-auto flex items-center gap-1">
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};


const extensions = [
    StarterKit.configure({
        // Ensure all basic nodes are enabled for HTML paste
        heading: {
            levels: [1, 2, 3, 4],
        },
    }),
    Image.configure({
        HTMLAttributes: {
            class: "rounded-lg border shadow-sm max-w-full h-auto my-4",
        },
    }),
    /*
    Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
            class: "text-primary underline underline-offset-4",
        },
    }),
    */
];

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions,
        content: value,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none max-w-none min-h-[300px]",
            },
            handlePaste: (view, event, slice) => {
                // Check if there's HTML content in the clipboard
                const html = event.clipboardData?.getData("text/html");
                const text = event.clipboardData?.getData("text/plain") || "";

                console.log("Paste Debug:", { hasHtml: !!html, textSnippet: text.slice(0, 50) });

                if (html) {
                    // If we have HTML, let TipTap parse and insert it
                    // Returning false tells TipTap to handle it normally with the HTML
                    return false;
                }

                // Check if the plain text looks like HTML (starts with < and contains >)
                if (text.trim().startsWith("<") && text.includes(">")) {
                    // This is HTML pasted as plain text, we need to parse it
                    event.preventDefault();

                    // Use the editor to insert HTML content
                    const { state, dispatch } = view;
                    const tr = state.tr;

                    // Parse the HTML and insert it at cursor position
                    // We'll use a temporary div to parse the HTML
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = text;

                    // Get the editor from the view and insert HTML
                    const editorInstance = (view as any).editor;
                    if (editorInstance) {
                        editorInstance.commands.insertContent(text);
                    }

                    return true;
                }

                // Default behavior for other content
                return false;
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            // Only update if the content has actually changed to avoid cursor jumping
            // primitive check, but usually sufficient for controlled inputs
            if (editor.getText() === "" && value === "") return;
            // If value is completely different, we might want to set content?
            // This is tricky with TipTap controlled mode.
            // Usually, we trust the editor state unless value changes externally significantly.
            // For now, let's strictly rely on onUpdate to push changes up, 
            // and only pull changes down if it's a fresh load (empty editor).
            if (editor.isEmpty && value) {
                editor.commands.setContent(value)
            }
        }
    }, [value, editor]);

    return (
        <div className={cn("border rounded-md overflow-hidden bg-white shadow-sm flex flex-col", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="flex-1 overflow-y-auto bg-white" />
        </div>
    );
}
