import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Highlighter, Heading1, Heading2, List, ListOrdered, Quote } from "lucide-react";
import { useEffect } from "react";

interface RichEditorProps {
    content: string;
    onChange: (html: string) => void;
    isEditable?: boolean;
    userColor?: string;
}

const MenuBar = ({ editor, userColor }: { editor: any, userColor?: string }) => {
    if (!editor) {
        return null;
    }

    const addHighlight = () => {
        // Use user's specific color or fallback
        const color = userColor || "#fef08a";
        editor.chain().focus().toggleHighlight({ color }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/50 p-2 backdrop-blur-sm">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("bold") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("italic") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                onClick={addHighlight}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("highlight") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Highlight"
            >
                <Highlighter className="h-4 w-4" style={{ color: userColor ? 'inherit' : undefined }} />
                {userColor && <span className="sr-only">Highlight with {userColor}</span>}
                {userColor && <div className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: userColor }} />}
            </button>

            <div className="mx-2 h-4 w-px bg-gray-300"></div>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <Heading1 className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <Heading2 className="h-4 w-4" />
            </button>

            <div className="mx-2 h-4 w-px bg-gray-300"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("bulletList") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <List className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("orderedList") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <ListOrdered className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("blockquote") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
            >
                <Quote className="h-4 w-4" />
            </button>
        </div>
    );
};

export default function RichEditor({ content, onChange, isEditable = true, userColor }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Placeholder.configure({
                placeholder: "Start writing...",
            }),
        ],
        content,
        editable: isEditable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8 max-w-none transition-all duration-300 ease-in-out marker:text-blue-500",
            },
        },
    });

    // Update content from props (collaboration)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            const currentContent = editor.getHTML();
            if (content !== currentContent) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/60 bg-white/70 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md">
            {isEditable && <MenuBar editor={editor} userColor={userColor} />}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
