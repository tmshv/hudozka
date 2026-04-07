import type { Editor } from "@tiptap/react"
import "./Toolbar.css"

export type ToolbarProps = {
    editor: Editor | null
    onSave: () => void
    onPublish: () => void
    saving: boolean
    publishing: boolean
    dirty: boolean
    hasDraft: boolean
    markdownMode: boolean
    onToggleMarkdown: () => void
}

export function Toolbar({
    editor,
    onSave,
    onPublish,
    saving,
    publishing,
    dirty,
    hasDraft,
    markdownMode,
    onToggleMarkdown,
}: ToolbarProps) {
    if (!editor) return null

    const canSave = dirty
    const canPublish = dirty || hasDraft

    return (
        <div className="toolbar">
            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive("bold") ? "active" : ""}
                    title="Bold"
                >
                    B
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "active" : ""}
                    title="Italic"
                >
                    I
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive("strike") ? "active" : ""}
                    title="Strikethrough"
                >
                    S
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive("code") ? "active" : ""}
                    title="Inline code"
                >
                    &lt;/&gt;
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive("heading", { level: 1 }) ? "active" : ""}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
                >
                    H3
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive("bulletList") ? "active" : ""}
                    title="Bullet list"
                >
                    List
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive("orderedList") ? "active" : ""}
                    title="Numbered list"
                >
                    1.
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive("blockquote") ? "active" : ""}
                    title="Blockquote"
                >
                    &ldquo;
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive("codeBlock") ? "active" : ""}
                    title="Code block"
                >
                    Code
                </button>
                <button
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal rule"
                >
                    ---
                </button>
            </div>

            <div className="toolbar-group">
                <button
                    onClick={onToggleMarkdown}
                    className={markdownMode ? "active" : ""}
                    title="Toggle markdown view"
                >
                    MD
                </button>
            </div>

            <div className="toolbar-group toolbar-actions">
                <button
                    onClick={onSave}
                    disabled={!canSave || saving}
                    className="toolbar-save-btn"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
                <button
                    onClick={onPublish}
                    disabled={!canPublish || publishing}
                    className="toolbar-publish-btn"
                >
                    {publishing ? "Publishing..." : "Publish"}
                </button>
            </div>
        </div>
    )
}
