# Writer Draft/Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add draft-save and explicit publish workflow to hudozka-writer so editors can save work-in-progress without pushing changes live.

**Architecture:** PocketBase `pages` collection gets a `draft` JSON field for WIP content alongside existing `doc` (published). The `draft: boolean` field is replaced with `published: boolean`. The editor loads `draft ?? doc`, tracks dirty state via JSON snapshot comparison, and provides Save (writes `draft`), Publish (writes `doc`, clears `draft`), and Discard (clears `draft`, reloads from `doc`) actions.

**Tech Stack:** React, TipTap, PocketBase JS SDK

**Spec:** `docs/superpowers/specs/2026-04-07-writer-draft-publish.md`

---

### Task 1: Update PbPage type

**Files:**
- Modify: `modules/hudozka-writer/src/types.ts:28-37`

- [x] **Step 1: Update PbPage type definition**

Replace the current `PbPage` type:

```ts
export type PbPage = PbRecord & {
    title: string
    slug: string
    excerpt: string
    date: string
    cover: string
    doc: DocV1
    tags: string[]
    published: boolean
    draft: DocV1 | null
}
```

- [x] **Step 2: Verify build**

Run: `cd modules/hudozka-writer && npx tsc --noEmit`
Expected: errors in `App.tsx` where `draft` was used as boolean — that's expected, we fix it in Task 4.

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/types.ts
git commit -m "feat(writer): update PbPage type for draft/publish workflow"
```

---

### Task 2: Add Save/Publish/Discard handlers and dirty tracking to Editor

**Files:**
- Modify: `modules/hudozka-writer/src/components/Editor.tsx`

- [x] **Step 1: Rewrite Editor component with draft support**

Replace the full content of `Editor.tsx`:

```tsx
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "@tiptap/markdown"
import Link from "@tiptap/extension-link"
import { useState, useCallback, useRef, useEffect } from "react"
import { pb } from "../pb"
import { docToTiptap, tiptapToDoc } from "../lib/serialize"
import { Toolbar } from "./Toolbar"
import { DraftBanner } from "./DraftBanner"
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
            {hasDraft && (
                <DraftBanner onDiscard={handleDiscard} />
            )}
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
```

- [x] **Step 2: Commit**

```bash
git add modules/hudozka-writer/src/components/Editor.tsx
git commit -m "feat(writer): add save/publish/discard handlers with dirty tracking"
```

---

### Task 3: Create DraftBanner component

**Files:**
- Create: `modules/hudozka-writer/src/components/DraftBanner.tsx`
- Create: `modules/hudozka-writer/src/components/DraftBanner.css`

- [x] **Step 1: Create DraftBanner component**

`modules/hudozka-writer/src/components/DraftBanner.tsx`:

```tsx
import "./DraftBanner.css"

export type DraftBannerProps = {
    onDiscard: () => void
}

export function DraftBanner({ onDiscard }: DraftBannerProps) {
    return (
        <div className="draft-banner">
            <span>You have unpublished changes</span>
            <button onClick={onDiscard} className="draft-banner-discard">
                Discard
            </button>
        </div>
    )
}
```

- [x] **Step 2: Create DraftBanner styles**

`modules/hudozka-writer/src/components/DraftBanner.css`:

```css
.draft-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #fff8e1;
    border: 1px solid #ffe082;
    border-radius: 4px;
    margin-bottom: 12px;
    font-size: 0.9rem;
}

.draft-banner-discard {
    padding: 4px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
}

.draft-banner-discard:hover {
    background: #f0f0f0;
}
```

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/components/DraftBanner.tsx modules/hudozka-writer/src/components/DraftBanner.css
git commit -m "feat(writer): add DraftBanner component"
```

---

### Task 4: Update Toolbar with Publish button

**Files:**
- Modify: `modules/hudozka-writer/src/components/Toolbar.tsx`
- Modify: `modules/hudozka-writer/src/components/Toolbar.css`

- [x] **Step 1: Update Toolbar component**

Replace the full content of `Toolbar.tsx`:

```tsx
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
```

- [x] **Step 2: Update Toolbar styles**

Replace `.toolbar-save` and `.toolbar-save-btn` rules in `Toolbar.css`. Remove old `.toolbar-save` and `.toolbar-save-btn` rules and add:

```css
.toolbar-actions {
    margin-left: auto;
    gap: 4px;
}

.toolbar-save-btn {
    padding: 4px 16px !important;
}

.toolbar-save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
}

.toolbar-publish-btn {
    background: #213547 !important;
    color: white !important;
    border-color: #213547 !important;
    padding: 4px 16px !important;
}

.toolbar-publish-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
}
```

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/components/Toolbar.tsx modules/hudozka-writer/src/components/Toolbar.css
git commit -m "feat(writer): add Publish button and update toolbar layout"
```

---

### Task 5: Update App with published toggle and fix duplicate handler

**Files:**
- Modify: `modules/hudozka-writer/src/App.tsx`
- Modify: `modules/hudozka-writer/src/App.css`

- [x] **Step 1: Update App component**

Replace the full content of `App.tsx`:

```tsx
import { useState, useEffect, useCallback } from "react"
import { pb } from "./pb"
import { Login } from "./components/Login"
import { Editor } from "./components/Editor"
import type { PbPage } from "./types"
import "./App.css"

function getSlugFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search)
    return params.get("page")
}

export function App() {
    const [authenticated, setAuthenticated] = useState(pb.authStore.isValid)
    const [page, setPage] = useState<PbPage | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const slug = getSlugFromUrl()

    const loadPage = useCallback(async (slug: string) => {
        setLoading(true)
        setError("")
        try {
            const record = await pb.collection("pages").getFirstListItem<PbPage>(
                `slug="${slug}"`,
            )
            setPage(record)
        } catch {
            setError(`Page "${slug}" not found`)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (authenticated && slug) {
            loadPage(slug)
        }
    }, [authenticated, slug, loadPage])

    function handleLogout() {
        pb.authStore.clear()
        setAuthenticated(false)
        setPage(null)
    }

    async function handleDuplicate() {
        if (!page) return
        const newSlug = `${page.slug}-copy`
        try {
            const record = await pb.collection("pages").create<PbPage>({
                title: `${page.title} (copy)`,
                slug: newSlug,
                excerpt: page.excerpt,
                date: page.date,
                cover: page.cover,
                doc: page.doc,
                tags: page.tags,
                published: false,
                draft: null,
            })
            window.location.search = `?page=${record.slug}`
        } catch (err) {
            console.error("Duplicate failed:", err)
            alert("Duplicate failed. Check console.")
        }
    }

    async function handleTogglePublished() {
        if (!page) return
        try {
            const updated = await pb.collection("pages").update<PbPage>(page.id, {
                published: !page.published,
            })
            setPage(updated)
        } catch (err) {
            console.error("Toggle published failed:", err)
            alert("Toggle published failed. Check console.")
        }
    }

    if (!authenticated) {
        return <Login onLogin={() => setAuthenticated(true)} />
    }

    if (!slug) {
        return (
            <div className="app-message">
                <p>Add <code>?page=slug</code> to the URL to edit a page.</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        )
    }

    if (loading) {
        return <div className="app-message">Loading...</div>
    }

    if (error) {
        return (
            <div className="app-message">
                <p className="app-error">{error}</p>
                <button onClick={handleLogout}>Logout</button>
            </div>
        )
    }

    if (!page) {
        return <div className="app-message">Loading...</div>
    }

    return (
        <div className="app">
            <header className="app-header">
                <span className="app-title">{page.title}</span>
                <span className="app-slug">/{page.slug}</span>
                <label className="app-published-toggle">
                    <input
                        type="checkbox"
                        checked={page.published}
                        onChange={handleTogglePublished}
                    />
                    Published
                </label>
                <button onClick={handleDuplicate}>Duplicate</button>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main className="app-main">
                <Editor page={page} />
            </main>
        </div>
    )
}
```

- [x] **Step 2: Add published toggle styles to App.css**

Add to the end of `App.css`:

```css
.app-published-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
}

.app-published-toggle input {
    cursor: pointer;
}
```

- [x] **Step 3: Verify build**

Run: `cd modules/hudozka-writer && npx tsc --noEmit`
Expected: no errors.

- [x] **Step 4: Commit**

```bash
git add modules/hudozka-writer/src/App.tsx modules/hudozka-writer/src/App.css
git commit -m "feat(writer): add published toggle and update duplicate for new schema"
```

---

### Task 6: Manual verification

- [x] **Step 1: Start the writer dev server** (skipped - manual verification)

Run: `cd modules/hudozka-writer && npm run dev`

- [x] **Step 2: Test the workflow** (skipped - manual verification)

Open the writer in a browser with `?page=<some-slug>`. Verify:

1. Page loads, Save is disabled, Publish is disabled (no changes)
2. Edit some text — Save becomes enabled, Publish becomes enabled
3. Click Save — Save becomes disabled, Publish stays enabled, draft banner appears
4. Reload the page — draft banner shows, editor loads draft content
5. Click Discard — editor reverts to published content, banner disappears
6. Edit and click Publish — both buttons disabled, no banner
7. Toggle Published checkbox — toggles immediately
8. Duplicate — creates unpublished copy
