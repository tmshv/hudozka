import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "@tiptap/markdown"
import Link from "@tiptap/extension-link"
import { useState, useCallback } from "react"
import { pb } from "../pb"
import { docToTiptap, tiptapToDoc } from "../lib/serialize"
import { Toolbar } from "./Toolbar"
import {
    WriterDocument,
    ImageBlock,
    DocumentBlock,
    EmbedBlock,
    CardGridBlock,
} from "../nodes"
import { BlockInsert } from "../extensions/BlockInsert"
import { SlashCommands } from "../extensions/SlashCommands"
import "../nodes/nodes.css"
import "./Editor.css"
import type { PbPage, DocV1 } from "../types"

export type EditorProps = {
    page: PbPage
}

export function Editor({ page }: EditorProps) {
    const [saving, setSaving] = useState(false)
    const [markdownMode, setMarkdownMode] = useState(false)
    const [markdownText, setMarkdownText] = useState("")

    const tiptapDoc = docToTiptap(page.doc)

    const editor = useEditor({
        extensions: [
            WriterDocument,
            StarterKit.configure({
                document: false,
            }),
            Markdown,
            Link.configure({ openOnClick: false }),
            ImageBlock,
            DocumentBlock,
            EmbedBlock,
            CardGridBlock,
            BlockInsert,
            SlashCommands,
        ],
        content: tiptapDoc,
    })

    const handleToggleMarkdown = useCallback(() => {
        if (!editor) return

        if (!markdownMode) {
            // Switching to markdown mode: serialize editor content
            const md = editor.getMarkdown()
            setMarkdownText(md)
            setMarkdownMode(true)
        } else {
            // Switching back to rendered mode: parse markdown into editor
            editor.commands.setContent(markdownText, { contentType: "markdown" })
            setMarkdownMode(false)
        }
    }, [editor, markdownMode, markdownText])

    const handleSave = useCallback(async () => {
        if (!editor) return
        setSaving(true)
        try {
            if (markdownMode) {
                // Apply markdown text back to editor before saving
                editor.commands.setContent(markdownText, { contentType: "markdown" })
                setMarkdownMode(false)
            }
            const json = editor.getJSON()
            const doc: DocV1 = tiptapToDoc(json.content ?? [])
            await pb.collection("pages").update(page.id, { doc })
        } catch (err) {
            console.error("Save failed:", err)
            alert("Save failed. Check console.")
        } finally {
            setSaving(false)
        }
    }, [editor, page.id, markdownMode, markdownText])

    return (
        <div className="editor">
            <Toolbar
                editor={editor}
                onSave={handleSave}
                saving={saving}
                markdownMode={markdownMode}
                onToggleMarkdown={handleToggleMarkdown}
            />
            {markdownMode ? (
                <textarea
                    className="editor-markdown"
                    value={markdownText}
                    onChange={(e) => setMarkdownText(e.target.value)}
                />
            ) : (
                <EditorContent editor={editor} className="editor-content" />
            )}
        </div>
    )
}
