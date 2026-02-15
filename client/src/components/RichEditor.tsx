import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import CharacterCount from "@tiptap/extension-character-count";
import {
    Bold, Italic, Highlighter, Heading1, Heading2, List,
    ListOrdered, Quote, Code, Table as TableIcon,
    Trash2, Columns, Rows, Type
} from "lucide-react";
import { useEffect } from "react";
import { all, createLowlight } from "lowlight";
import "highlight.js/styles/github-dark.css";

const lowlight = createLowlight(all);

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
        const color = userColor || "#fef08a";
        editor.chain().focus().toggleHighlight({ color }).run();
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50/50 p-2 backdrop-blur-sm sticky top-0 z-30">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("bold") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Bold"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("italic") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Italic"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                onClick={addHighlight}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("highlight") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Highlight"
            >
                <Highlighter className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("codeBlock") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Code Block"
            >
                <Code className="h-4 w-4" />
            </button>

            <div className="mx-2 h-4 w-px bg-gray-300"></div>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="H1"
            >
                <Heading1 className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="H2"
            >
                <Heading2 className="h-4 w-4" />
            </button>

            <div className="mx-2 h-4 w-px bg-gray-300"></div>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("bulletList") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Bullet List"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("orderedList") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Ordered List"
            >
                <ListOrdered className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`rounded-md p-1.5 transition-colors hover:bg-gray-200/80 ${editor.isActive("blockquote") ? "bg-gray-200 text-black shadow-inner" : "text-gray-600"}`}
                title="Quote"
            >
                <Quote className="h-4 w-4" />
            </button>

            <div className="mx-2 h-4 w-px bg-gray-300"></div>

            <button
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="rounded-md p-1.5 transition-colors hover:bg-gray-200/80 text-gray-600"
                title="Insert Table"
            >
                <TableIcon className="h-4 w-4" />
            </button>

            {editor.isActive("table") && (
                <div className="flex items-center gap-1 ml-2 border-l border-gray-300 pl-2">
                    <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1 hover:bg-gray-200 rounded text-gray-500" title="Add Column"><Columns className="h-3.5 w-3.5" /></button>
                    <button onClick={() => editor.chain().focus().addRowAfter().run()} className="p-1 hover:bg-gray-200 rounded text-gray-500" title="Add Row"><Rows className="h-3.5 w-3.5" /></button>
                    <button onClick={() => editor.chain().focus().deleteTable().run()} className="p-1 hover:bg-red-100 hover:text-red-500 rounded text-gray-500" title="Delete Table"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
            )}
        </div>
    );
};

const CustomBubbleMenu = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    return (
        <BubbleMenu
            editor={editor}
            className="flex items-center gap-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-xl backdrop-blur-md"
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 transition-colors hover:bg-gray-100 ${editor.isActive("bold") ? "text-blue-600" : "text-gray-600"}`}
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 transition-colors hover:bg-gray-100 ${editor.isActive("italic") ? "text-blue-600" : "text-gray-600"}`}
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-1.5 transition-colors hover:bg-gray-100 ${editor.isActive("heading", { level: 2 }) ? "text-blue-600" : "text-gray-600"}`}
            >
                <Type className="h-4 w-4" />
            </button>
        </BubbleMenu>
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
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            CharacterCount,
        ],
        content,
        editable: isEditable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-8 max-w-none transition-all duration-300 ease-in-out marker:text-blue-500 editor-content",
            },
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            const currentContent = editor.getHTML();
            if (content !== currentContent) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200/60 bg-white/70 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md relative">
            {isEditable && <MenuBar editor={editor} userColor={userColor} />}
            {isEditable && <CustomBubbleMenu editor={editor} />}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <EditorContent editor={editor} />
            </div>
            {editor && (
                <div className="absolute bottom-4 right-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/50 px-2 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                    {editor.storage.characterCount.words()} words / {editor.storage.characterCount.characters()} characters
                </div>
            )}
        </div>
    );
}
