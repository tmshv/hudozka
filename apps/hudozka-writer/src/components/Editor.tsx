import Link from "@tiptap/extension-link"
import { Markdown } from "@tiptap/markdown"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useCallback, useEffect, useRef, useState } from "react"
import { SlashCommands } from "../extensions/SlashCommands"
import { docToTiptap, tiptapToDoc } from "../lib/serialize"
import { CardGridBlock, DocumentBlock, EmbedBlock, ImageBlock, TextBlock, WriterDocument } from "../nodes"
import { pb } from "../pb"
import { DraftBanner } from "./DraftBanner"
import { Toolbar } from "./Toolbar"
import "../nodes/nodes.css"
import "./Editor.css"
import type { DocV1, PbPage } from "../types"

function serializeDoc(doc: DocV1): string {
    return JSON.stringify(doc)
}

export type EditorProps = {
    page: PbPage
}

export function Editor({ page }: EditorProps) {
    const [saving, setSaving] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const [markdownMode, setMarkdownMode] = useState(false)
    const [markdownText, setMarkdownText] = useState("")
    const [dirty, setDirty] = useState(false)
    const [hasDraft, setHasDraft] = useState(page.draft !== null)
    const [publishedDoc, setPublishedDoc] = useState(page.doc)

    const snapshotRef = useRef("")

    const initialDoc = page.draft ?? page.doc
    const tiptapDoc = docToTiptap(initialDoc)

    // Set initial snapshot
    useEffect(() => {
        snapshotRef.current = serializeDoc(initialDoc)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const editor = useEditor({
        extensions: [
            WriterDocument,
            StarterKit.configure({
                document: false,
            }),
            TextBlock,
            Markdown,
            Link.configure({ openOnClick: false }),
            ImageBlock,
            DocumentBlock,
            EmbedBlock,
            CardGridBlock,
            SlashCommands,
        ],
        content: tiptapDoc,
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            const doc = tiptapToDoc(json.content ?? [])
            const current = serializeDoc(doc)
            setDirty(current !== snapshotRef.current)
        },
    })

    const getCurrentDoc = useCallback((): DocV1 => {
        if (!editor) return { version: 1, blocks: [] }
        if (markdownMode) {
            editor.commands.setContent(markdownText, { contentType: "markdown" })
            setMarkdownMode(false)
        }
        const json = editor.getJSON()
        return tiptapToDoc(json.content ?? [])
    }, [editor, markdownMode, markdownText])

    const handleToggleMarkdown = useCallback(() => {
        if (!editor) return
        if (!markdownMode) {
            const md = editor.getMarkdown()
            setMarkdownText(md)
            setMarkdownMode(true)
        } else {
            editor.commands.setContent(markdownText, { contentType: "markdown" })
            setMarkdownMode(false)
        }
    }, [editor, markdownMode, markdownText])

    const handleSave = useCallback(async () => {
        if (!editor) return
        setSaving(true)
        try {
            const doc = getCurrentDoc()
            await pb.collection("pages").update(page.id, { draft: doc })
            snapshotRef.current = serializeDoc(doc)
            setDirty(false)
            setHasDraft(true)
        } catch (err) {
            console.error("Save failed:", err)
            alert("Save failed. Check console.")
        } finally {
            setSaving(false)
        }
    }, [editor, page.id, getCurrentDoc])

    const handlePublish = useCallback(async () => {
        if (!editor) return
        setPublishing(true)
        try {
            const doc = getCurrentDoc()
            await pb.collection("pages").update(page.id, { doc, draft: null })
            snapshotRef.current = serializeDoc(doc)
            setDirty(false)
            setHasDraft(false)
            setPublishedDoc(doc)
        } catch (err) {
            console.error("Publish failed:", err)
            alert("Publish failed. Check console.")
        } finally {
            setPublishing(false)
        }
    }, [editor, page.id, getCurrentDoc])

    const handleDiscard = useCallback(async () => {
        if (!editor) return
        try {
            await pb.collection("pages").update(page.id, { draft: null })
            const tiptap = docToTiptap(publishedDoc)
            editor.commands.setContent(tiptap)
            snapshotRef.current = serializeDoc(publishedDoc)
            setDirty(false)
            setHasDraft(false)
            setMarkdownMode(false)
        } catch (err) {
            console.error("Discard failed:", err)
            alert("Discard failed. Check console.")
        }
    }, [editor, page.id, publishedDoc])

    return (
        <div className="editor">
            <Toolbar
                editor={editor}
                onSave={handleSave}
                onPublish={handlePublish}
                saving={saving}
                publishing={publishing}
                dirty={dirty}
                hasDraft={hasDraft}
                markdownMode={markdownMode}
                onToggleMarkdown={handleToggleMarkdown}
            />
            {hasDraft && <DraftBanner onDiscard={handleDiscard} />}
            {markdownMode ? (
                <textarea
                    className="editor-markdown"
                    value={markdownText}
                    onChange={e => setMarkdownText(e.target.value)}
                />
            ) : (
                <EditorContent editor={editor} className="editor-content" />
            )}
        </div>
    )
}
