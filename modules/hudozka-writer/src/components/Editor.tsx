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
import "../nodes/nodes.css"
import "./Editor.css"
import type { PbPage, DocV1 } from "../types"

export type EditorProps = {
    page: PbPage
}

export function Editor({ page }: EditorProps) {
    const [saving, setSaving] = useState(false)

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
        ],
        content: tiptapDoc,
    })

    const handleSave = useCallback(async () => {
        if (!editor) return
        setSaving(true)
        try {
            const json = editor.getJSON()
            const doc: DocV1 = tiptapToDoc(json.content ?? [])
            await pb.collection("pages").update(page.id, { doc })
        } catch (err) {
            console.error("Save failed:", err)
            alert("Save failed. Check console.")
        } finally {
            setSaving(false)
        }
    }, [editor, page.id])

    return (
        <div className="editor">
            <Toolbar editor={editor} onSave={handleSave} saving={saving} />
            <EditorContent editor={editor} className="editor-content" />
        </div>
    )
}
