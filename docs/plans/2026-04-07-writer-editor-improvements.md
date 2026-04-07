# Writer Editor Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the hudozka-writer Tiptap editor with proper markdown serialization, a block insertion menu, file block editing, and enhanced card grid display.

**Architecture:** All work is inside `modules/hudozka-writer/`. The editor uses Tiptap 3 with React 19 node views and PocketBase backend. We fix the broken serialization layer first (foundation for everything else), then add UI features on top. No external state library — all state stays in React hooks + Tiptap.

**Tech Stack:** Tiptap 3, `@tiptap/markdown`, `@tiptap/suggestion` (new dep), React 19, PocketBase, Vite 8, TypeScript

---

## File Map

| File                               | Action | Responsibility                                          |
|------------------------------------|--------|---------------------------------------------------------|
| `src/lib/serialize.ts`             | Modify | Use MarkdownManager for text block ↔ Tiptap conversion  |
| `src/lib/markdown.ts`              | Create | Shared MarkdownManager instance factory                 |
| `src/components/Editor.tsx`        | Modify | Add markdown toggle state, textarea mode, new extensions |
| `src/components/Editor.css`        | Modify | Styles for markdown textarea                            |
| `src/components/Toolbar.tsx`       | Modify | Add MD toggle button                                    |
| `src/components/Toolbar.css`       | Modify | Style for MD toggle active state                        |
| `src/components/BlockMenu.tsx`     | Create | Shared block type dropdown used by "+" and slash        |
| `src/components/BlockMenu.css`     | Create | BlockMenu styles                                        |
| `src/components/FilePicker.tsx`    | Create | File browse/upload modal (mirrors ImagePicker)          |
| `src/components/FilePicker.css`    | Create | FilePicker styles (reuses picker-* classes)             |
| `src/extensions/SlashCommands.ts`  | Create | Tiptap extension for `/` slash commands                 |
| `src/extensions/BlockInsert.tsx`   | Create | Tiptap plugin view for hover "+" button                 |
| `src/extensions/BlockInsert.css`   | Create | Styles for "+" button and positioning                   |
| `src/nodes/DocumentBlock.tsx`      | Modify | Add interactive editing (file picker, title input)      |
| `src/nodes/CardGridBlock.tsx`      | Modify | Fetch and display resolved page titles                  |
| `src/nodes/nodes.css`             | Modify | Styles for document block controls, card grid list      |
| `src/nodes/index.ts`              | Modify | Export new extensions                                   |
| `src/types.ts`                     | Modify | Add PbFile type                                         |

---

### Task 1: Fix Markdown Serialization

**Files:**
- Create: `src/lib/markdown.ts`
- Modify: `src/lib/serialize.ts`

This is the foundation — fixes the lossy text block round-trip.

- [x] **Step 1: Create shared MarkdownManager factory**

Create `src/lib/markdown.ts`:

```ts
import { MarkdownManager } from "@tiptap/markdown"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"

let manager: MarkdownManager | null = null

export function getMarkdownManager(): MarkdownManager {
    if (!manager) {
        manager = new MarkdownManager({
            extensions: [
                StarterKit,
                Link,
            ],
        })
    }
    return manager
}
```

- [x] **Step 2: Rewrite textBlockToTiptap to use markdown parsing**

In `src/lib/serialize.ts`, replace the `textBlockToTiptap` function. The new version parses markdown into Tiptap JSON using the MarkdownManager:

Replace the import block at the top:

```ts
import type { JSONContent } from "@tiptap/core"
import type {
    DocV1,
    DocV1Block,
    DocV1BlockText,
    DocV1BlockImage,
    DocV1BlockDocument,
    DocV1BlockEmbed,
    DocV1BlockCardGrid,
} from "../types"
import { generateBlockId } from "./id"
import { getMarkdownManager } from "./markdown"
```

Replace `textBlockToTiptap`:

```ts
function textBlockToTiptap(block: DocV1BlockText): JSONContent[] {
    const manager = getMarkdownManager()
    const parsed = manager.parse(block.text)
    return parsed.content ?? []
}
```

- [x] **Step 3: Rewrite text serialization to use markdown output**

Replace `tiptapTextContent` and `textNodesToMarkdown` with:

```ts
function textNodesToMarkdown(nodes: JSONContent[]): string {
    const manager = getMarkdownManager()
    const doc: JSONContent = { type: "doc", content: nodes }
    return manager.serialize(doc)
}
```

Remove the old `tiptapTextContent` function entirely — it's no longer used.

- [x] **Step 4: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [x] **Step 5: Manual test round-trip** (skipped - not automatable)

Run `npm run dev` in the writer module. Open a page with formatted text (bold, headings, lists). Verify:
1. Formatted text renders correctly in the editor
2. Use the toolbar to add bold/italic/headings
3. Save the page
4. Reload — formatting is preserved

- [x] **Step 6: Commit**

```bash
git add modules/hudozka-writer/src/lib/markdown.ts modules/hudozka-writer/src/lib/serialize.ts
git commit -m "fix: use @tiptap/markdown for text block serialization"
```

---

### Task 2: Global Markdown Toggle

**Files:**
- Modify: `src/components/Editor.tsx`
- Modify: `src/components/Editor.css`
- Modify: `src/components/Toolbar.tsx`
- Modify: `src/components/Toolbar.css`

- [x] **Step 1: Add MD toggle button to Toolbar**

In `src/components/Toolbar.tsx`, add `markdownMode` and `onToggleMarkdown` props:

```tsx
export type ToolbarProps = {
    editor: Editor | null
    onSave: () => void
    saving: boolean
    markdownMode: boolean
    onToggleMarkdown: () => void
}
```

Add a new toolbar group before the save group (before the closing `</div>` of the toolbar):

```tsx
<div className="toolbar-group">
    <button
        onClick={onToggleMarkdown}
        className={markdownMode ? "active" : ""}
        title="Toggle markdown view"
    >
        MD
    </button>
</div>
```

Update the destructured props:

```tsx
export function Toolbar({ editor, onSave, saving, markdownMode, onToggleMarkdown }: ToolbarProps) {
```

- [x] **Step 2: Add markdown mode state and textarea to Editor**

In `src/components/Editor.tsx`, add state and toggle logic:

```tsx
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
        ],
        content: tiptapDoc,
    })

    const handleToggleMarkdown = useCallback(() => {
        if (!editor) return

        if (!markdownMode) {
            // Switching to markdown mode: serialize editor content
            const md = editor.storage.markdown.getMarkdown()
            setMarkdownText(md)
            setMarkdownMode(true)
        } else {
            // Switching back to rendered mode: parse markdown into editor
            editor.commands.setContent(markdownText)
            setMarkdownMode(false)
        }
    }, [editor, markdownMode, markdownText])

    const handleSave = useCallback(async () => {
        if (!editor) return
        setSaving(true)
        try {
            if (markdownMode) {
                // Apply markdown text back to editor before saving
                editor.commands.setContent(markdownText)
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
```

- [x] **Step 3: Add markdown textarea styles**

Append to `src/components/Editor.css`:

```css
.editor-markdown {
    width: 100%;
    min-height: 400px;
    padding: 16px;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.6;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
}

.editor-markdown:focus {
    border-color: #213547;
}
```

- [x] **Step 4: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [x] **Step 5: Manual test** (skipped - not automatable)

Run `npm run dev`. Open a page with content:
1. Click "MD" button — textarea shows markdown with formatting (headings, bold, etc.)
2. Edit markdown in textarea
3. Click "MD" again — editor shows rendered content with changes
4. Save — changes persist after reload

- [x] **Step 6: Commit**

```bash
git add modules/hudozka-writer/src/components/Editor.tsx modules/hudozka-writer/src/components/Editor.css modules/hudozka-writer/src/components/Toolbar.tsx
git commit -m "feat: add global markdown/rendered toggle"
```

---

### Task 3: Block Menu Component

**Files:**
- Create: `src/components/BlockMenu.tsx`
- Create: `src/components/BlockMenu.css`

Shared dropdown used by both the "+" button and slash commands.

- [x] **Step 1: Create BlockMenu component**

Create `src/components/BlockMenu.tsx`:

```tsx
import type { Editor } from "@tiptap/react"
import { generateBlockId } from "../lib/id"
import "./BlockMenu.css"

type BlockType = {
    label: string
    type: string
    attrs?: Record<string, unknown>
}

const BLOCK_TYPES: BlockType[] = [
    { label: "Text", type: "paragraph" },
    { label: "Image", type: "imageBlock", attrs: { id: "", imageId: "", wide: false, caption: "" } },
    { label: "File", type: "documentBlock", attrs: { id: "", fileId: "", title: "" } },
    { label: "Embed", type: "embedBlock", attrs: { id: "", src: "" } },
    { label: "Card Grid", type: "cardGridBlock", attrs: { id: "", items: "[]" } },
]

export type BlockMenuProps = {
    editor: Editor
    position: number
    onClose: () => void
    filter?: string
}

export function BlockMenu({ editor, position, onClose, filter }: BlockMenuProps) {
    const filtered = filter
        ? BLOCK_TYPES.filter((b) => b.label.toLowerCase().includes(filter.toLowerCase()))
        : BLOCK_TYPES

    function handleInsert(block: BlockType) {
        const id = generateBlockId()
        if (block.type === "paragraph") {
            editor.chain().focus().insertContentAt(position, {
                type: "paragraph",
                content: [],
            }).run()
        } else {
            editor.chain().focus().insertContentAt(position, {
                type: block.type,
                attrs: { ...block.attrs, id },
            }).run()
        }
        onClose()
    }

    if (filtered.length === 0) return null

    return (
        <div className="block-menu">
            {filtered.map((block) => (
                <button
                    key={block.type}
                    className="block-menu-item"
                    onClick={() => handleInsert(block)}
                >
                    {block.label}
                </button>
            ))}
        </div>
    )
}

export { BLOCK_TYPES }
export type { BlockType }
```

- [x] **Step 2: Create BlockMenu styles**

Create `src/components/BlockMenu.css`:

```css
.block-menu {
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 4px 0;
    min-width: 160px;
    z-index: 50;
}

.block-menu-item {
    display: block;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    font-size: 0.9rem;
}

.block-menu-item:hover {
    background: #f0f4ff;
}
```

- [x] **Step 3: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [x] **Step 4: Commit**

```bash
git add modules/hudozka-writer/src/components/BlockMenu.tsx modules/hudozka-writer/src/components/BlockMenu.css
git commit -m "feat: add BlockMenu component for block type selection"
```

---

### Task 4: Hover "+" Insert Button

**Files:**
- Create: `src/extensions/BlockInsert.tsx`
- Create: `src/extensions/BlockInsert.css`
- Modify: `src/components/Editor.tsx`
- Modify: `src/nodes/index.ts`

A Tiptap extension that shows a "+" button between blocks on hover.

- [x] **Step 1: Create BlockInsert extension**

Create `src/extensions/BlockInsert.tsx`:

```tsx
import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import { createRoot } from "react-dom/client"
import { BlockMenu } from "../components/BlockMenu"
import type { Editor } from "@tiptap/react"
import "./BlockInsert.css"

const blockInsertPluginKey = new PluginKey("blockInsert")

function createInsertButton(view: EditorView, tiptapEditor: Editor) {
    const button = document.createElement("button")
    button.className = "block-insert-btn"
    button.textContent = "+"
    button.style.display = "none"

    const menuContainer = document.createElement("div")
    menuContainer.className = "block-insert-menu-container"
    menuContainer.style.display = "none"
    const menuRoot = createRoot(menuContainer)

    let currentPos = 0
    let menuOpen = false

    function showMenu() {
        menuOpen = true
        menuContainer.style.display = "block"
        menuRoot.render(
            <BlockMenu
                editor={tiptapEditor}
                position={currentPos}
                onClose={hideMenu}
            />
        )
    }

    function hideMenu() {
        menuOpen = false
        menuContainer.style.display = "none"
    }

    button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (menuOpen) {
            hideMenu()
        } else {
            showMenu()
        }
    })

    // Close menu on click outside
    document.addEventListener("click", (e) => {
        if (menuOpen && !menuContainer.contains(e.target as Node) && e.target !== button) {
            hideMenu()
        }
    })

    const wrapper = document.createElement("div")
    wrapper.className = "block-insert-wrapper"
    wrapper.appendChild(button)
    wrapper.appendChild(menuContainer)

    view.dom.parentElement?.appendChild(wrapper)

    function handleMouseMove(e: MouseEvent) {
        if (menuOpen) return

        const editorRect = view.dom.getBoundingClientRect()
        const y = e.clientY

        // Find the position between blocks
        const pos = view.posAtCoords({ left: editorRect.left + 1, top: y })
        if (!pos) {
            button.style.display = "none"
            return
        }

        const resolvedPos = view.state.doc.resolve(pos.pos)
        // Only show between top-level blocks
        if (resolvedPos.depth > 1) {
            button.style.display = "none"
            return
        }

        // Get the block node at this position
        const blockPos = resolvedPos.before(1)
        const domNode = view.nodeDOM(blockPos)
        if (!domNode || !(domNode instanceof HTMLElement)) {
            button.style.display = "none"
            return
        }

        const nodeRect = domNode.getBoundingClientRect()
        const isNearBottom = y > nodeRect.bottom - 8

        if (isNearBottom) {
            // Position after this block
            currentPos = blockPos + resolvedPos.parent.nodeSize
            const top = nodeRect.bottom - editorRect.top
            wrapper.style.top = `${top}px`
            button.style.display = "block"
        } else if (y < nodeRect.top + 8) {
            // Position before this block
            currentPos = blockPos
            const top = nodeRect.top - editorRect.top
            wrapper.style.top = `${top}px`
            button.style.display = "block"
        } else {
            button.style.display = "none"
        }
    }

    function handleMouseLeave() {
        if (!menuOpen) {
            button.style.display = "none"
        }
    }

    view.dom.addEventListener("mousemove", handleMouseMove)
    view.dom.addEventListener("mouseleave", handleMouseLeave)

    return {
        destroy() {
            view.dom.removeEventListener("mousemove", handleMouseMove)
            view.dom.removeEventListener("mouseleave", handleMouseLeave)
            menuRoot.unmount()
            wrapper.remove()
        },
    }
}

export const BlockInsert = Extension.create({
    name: "blockInsert",

    addProseMirrorPlugins() {
        const editor = this.editor as Editor
        return [
            new Plugin({
                key: blockInsertPluginKey,
                view(editorView) {
                    const instance = createInsertButton(editorView, editor)
                    return {
                        destroy() {
                            instance.destroy()
                        },
                    }
                },
            }),
        ]
    },
})
```

- [x] **Step 2: Create BlockInsert styles**

Create `src/extensions/BlockInsert.css`:

```css
.block-insert-wrapper {
    position: absolute;
    left: -40px;
    transform: translateY(-50%);
    z-index: 20;
}

.block-insert-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: #888;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
}

.block-insert-btn:hover {
    border-color: #213547;
    color: #213547;
    background: #f0f4ff;
}

.block-insert-menu-container {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
}
```

- [x] **Step 3: Register BlockInsert in Editor**

In `src/components/Editor.tsx`, add the import and register the extension:

Add import:
```tsx
import { BlockInsert } from "../extensions/BlockInsert"
```

Add to the `extensions` array in `useEditor`:
```tsx
BlockInsert,
```

- [x] **Step 4: Make editor container position relative**

In `src/components/Editor.css`, add to the `.editor-content` rule (or create it if only `.editor-content .tiptap` exists):

```css
.editor-content {
    position: relative;
}
```

- [x] **Step 5: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [x] **Step 6: Manual test** (skipped - not automatable)

Run `npm run dev`. Hover between blocks — a "+" button should appear in the left gutter. Click it — block type dropdown opens. Select "Image" — an empty image block is inserted.

- [x] **Step 7: Commit**

```bash
git add modules/hudozka-writer/src/extensions/BlockInsert.tsx modules/hudozka-writer/src/extensions/BlockInsert.css modules/hudozka-writer/src/components/Editor.tsx modules/hudozka-writer/src/components/Editor.css
git commit -m "feat: add hover + button for block insertion"
```

---

### Task 5: Slash Commands

**Files:**
- Create: `src/extensions/SlashCommands.ts`
- Modify: `src/components/Editor.tsx`
- Modify: `package.json` (new dep: `@tiptap/suggestion`)

- [x] **Step 1: Install @tiptap/suggestion**

```bash
cd modules/hudozka-writer && npm install @tiptap/suggestion@^3.0.0
```

- [x] **Step 2: Create SlashCommands extension**

Create `src/extensions/SlashCommands.ts`:

```ts
import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import Suggestion from "@tiptap/suggestion"
import type { SuggestionOptions } from "@tiptap/suggestion"
import { createRoot } from "react-dom/client"
import { BlockMenu } from "../components/BlockMenu"
import { generateBlockId } from "../lib/id"
import type { Editor } from "@tiptap/react"

const slashCommandsPluginKey = new PluginKey("slashCommands")

type SlashCommandItem = {
    label: string
    type: string
    attrs?: Record<string, unknown>
}

const ITEMS: SlashCommandItem[] = [
    { label: "Text", type: "paragraph" },
    { label: "Image", type: "imageBlock", attrs: { id: "", imageId: "", wide: false, caption: "" } },
    { label: "File", type: "documentBlock", attrs: { id: "", fileId: "", title: "" } },
    { label: "Embed", type: "embedBlock", attrs: { id: "", src: "" } },
    { label: "Card Grid", type: "cardGridBlock", attrs: { id: "", items: "[]" } },
]

export const SlashCommands = Extension.create({
    name: "slashCommands",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                pluginKey: slashCommandsPluginKey,
                startOfLine: true,
                items: ({ query }: { query: string }) => {
                    return ITEMS.filter((item) =>
                        item.label.toLowerCase().includes(query.toLowerCase())
                    )
                },
                render: () => {
                    let container: HTMLDivElement | null = null
                    let root: ReturnType<typeof createRoot> | null = null

                    return {
                        onStart: (props: { editor: Editor; clientRect: (() => DOMRect | null) | null; command: (item: SlashCommandItem) => void; items: SlashCommandItem[] }) => {
                            container = document.createElement("div")
                            container.className = "slash-command-container"
                            document.body.appendChild(container)
                            root = createRoot(container)

                            const rect = props.clientRect?.()
                            if (rect) {
                                container.style.position = "fixed"
                                container.style.left = `${rect.left}px`
                                container.style.top = `${rect.bottom + 4}px`
                                container.style.zIndex = "50"
                            }

                            root.render(
                                <BlockMenu
                                    editor={props.editor}
                                    position={props.editor.state.selection.from}
                                    onClose={() => {}}
                                    filter=""
                                />
                            )
                        },
                        onUpdate: (props: { editor: Editor; clientRect: (() => DOMRect | null) | null; items: SlashCommandItem[]; query: string }) => {
                            if (!root || !container) return

                            const rect = props.clientRect?.()
                            if (rect) {
                                container.style.left = `${rect.left}px`
                                container.style.top = `${rect.bottom + 4}px`
                            }

                            root.render(
                                <BlockMenu
                                    editor={props.editor}
                                    position={props.editor.state.selection.from}
                                    onClose={() => {}}
                                    filter={props.query}
                                />
                            )
                        },
                        onExit: () => {
                            root?.unmount()
                            container?.remove()
                            container = null
                            root = null
                        },
                        onKeyDown: (props: { event: KeyboardEvent }) => {
                            if (props.event.key === "Escape") {
                                root?.unmount()
                                container?.remove()
                                container = null
                                root = null
                                return true
                            }
                            return false
                        },
                    }
                },
                command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: SlashCommandItem }) => {
                    const id = generateBlockId()

                    // Delete the slash command text
                    editor.chain().focus().deleteRange(range).run()

                    if (props.type === "paragraph") {
                        // Already have an empty paragraph from deleting the range
                        return
                    }

                    editor.chain().focus().insertContentAt(editor.state.selection.from, {
                        type: props.type,
                        attrs: { ...props.attrs, id },
                    }).run()
                },
            } satisfies Partial<SuggestionOptions<SlashCommandItem>>,
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})
```

- [x] **Step 3: Register SlashCommands in Editor**

In `src/components/Editor.tsx`, add the import:
```tsx
import { SlashCommands } from "../extensions/SlashCommands"
```

Add to the `extensions` array in `useEditor`:
```tsx
SlashCommands,
```

- [x] **Step 4: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [x] **Step 5: Manual test** (skipped - not automatable)

Run `npm run dev`. In an empty paragraph, type `/`. A dropdown should appear with block types. Type `/im` — only "Image" shows. Press Enter or click — image block is inserted.

- [x] **Step 6: Commit**

```bash
git add modules/hudozka-writer/src/extensions/SlashCommands.ts modules/hudozka-writer/src/components/Editor.tsx modules/hudozka-writer/package.json modules/hudozka-writer/package-lock.json
git commit -m "feat: add slash commands for block insertion"
```

---

### Task 6: File Block Editor

**Files:**
- Create: `src/components/FilePicker.tsx`
- Create: `src/components/FilePicker.css`
- Modify: `src/types.ts`
- Modify: `src/nodes/DocumentBlock.tsx`
- Modify: `src/nodes/nodes.css`

- [ ] **Step 1: Add PbFile type**

In `src/types.ts`, add after the `PbPage` type:

```ts
export type PbFile = PbRecord & {
    file: string
    filename: string
}
```

- [ ] **Step 2: Create FilePicker component**

Create `src/components/FilePicker.tsx`:

```tsx
import { useState, useEffect, useRef } from "react"
import { pb } from "../pb"
import type { PbFile } from "../types"
import "./FilePicker.css"

export type FilePickerProps = {
    onSelect: (fileId: string) => void
    onClose: () => void
}

export function FilePicker({ onSelect, onClose }: FilePickerProps) {
    const [files, setFiles] = useState<PbFile[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [tab, setTab] = useState<"browse" | "upload">("browse")
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadFiles(page)
    }, [page])

    async function loadFiles(p: number) {
        setLoading(true)
        try {
            const result = await pb.collection("files").getList<PbFile>(p, 20, {
                sort: "-created",
            })
            setFiles(result.items)
            setTotalPages(result.totalPages)
        } catch (err) {
            console.error("Failed to load files:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpload() {
        const file = fileRef.current?.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const record = await pb.collection("files").create<PbFile>({
                file,
                filename: file.name,
            })
            onSelect(record.id)
        } catch (err) {
            console.error("Upload failed:", err)
            alert("Upload failed. Check console.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="picker-overlay" onClick={onClose}>
            <div className="picker" onClick={(e) => e.stopPropagation()}>
                <div className="picker-header">
                    <button
                        className={tab === "browse" ? "active" : ""}
                        onClick={() => setTab("browse")}
                    >
                        Browse
                    </button>
                    <button
                        className={tab === "upload" ? "active" : ""}
                        onClick={() => setTab("upload")}
                    >
                        Upload
                    </button>
                    <button className="picker-close" onClick={onClose}>×</button>
                </div>

                {tab === "browse" && (
                    <div className="picker-browse">
                        {loading ? (
                            <div className="picker-loading">Loading...</div>
                        ) : (
                            <div className="file-picker-list">
                                {files.map((f) => (
                                    <button
                                        key={f.id}
                                        className="file-picker-item"
                                        onClick={() => onSelect(f.id)}
                                    >
                                        <span className="file-picker-icon">📎</span>
                                        <span className="file-picker-name">{f.filename}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="picker-pagination">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Prev
                            </button>
                            <span>{page} / {totalPages}</span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {tab === "upload" && (
                    <div className="picker-upload">
                        <input type="file" ref={fileRef} />
                        <button onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
```

- [ ] **Step 3: Create FilePicker styles**

Create `src/components/FilePicker.css`:

```css
.file-picker-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.file-picker-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    border-radius: 4px;
    font-size: 0.9rem;
}

.file-picker-item:hover {
    background: #f0f4ff;
}

.file-picker-icon {
    font-size: 1.1rem;
}

.file-picker-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

- [ ] **Step 4: Make DocumentBlock interactive**

Replace the entire content of `src/nodes/DocumentBlock.tsx`:

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { useState, useEffect } from "react"
import { pb } from "../pb"
import { FilePicker } from "../components/FilePicker"
import type { PbFile } from "../types"

function DocumentBlockView({ node, updateAttributes }: NodeViewProps) {
    const { fileId, title } = node.attrs
    const [filename, setFilename] = useState<string | null>(null)
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (!fileId) return
        pb.collection("files").getOne<PbFile>(fileId).then((f) => {
            setFilename(f.filename)
        }).catch(() => {
            setFilename(null)
        })
    }, [fileId])

    function handleSelect(newFileId: string) {
        updateAttributes({ fileId: newFileId })
        setShowPicker(false)
    }

    return (
        <NodeViewWrapper className="node-document-block" data-drag-handle>
            <div className="node-block-label">Document</div>
            {fileId ? (
                <div
                    className="node-document-file"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                >
                    📎 {filename ?? fileId}
                </div>
            ) : (
                <div
                    className="node-document-placeholder"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                >
                    Click to select file
                </div>
            )}
            <div className="node-document-controls">
                <input
                    type="text"
                    placeholder="Title"
                    value={title || ""}
                    onChange={(e) => updateAttributes({ title: e.target.value })}
                    className="node-document-title"
                />
                <button
                    className="node-image-pick-btn"
                    onClick={() => setShowPicker(true)}
                >
                    Pick
                </button>
            </div>
            {showPicker && (
                <FilePicker
                    onSelect={handleSelect}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </NodeViewWrapper>
    )
}

export const DocumentBlock = Node.create({
    name: "documentBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            fileId: { default: "" },
            title: { default: "" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-document-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-document-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(DocumentBlockView)
    },
})
```

- [ ] **Step 5: Add DocumentBlock styles**

Append to `src/nodes/nodes.css`:

```css
.node-document-block {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    margin: 8px 0;
    background: #fafafa;
    cursor: grab;
}

.node-document-file {
    padding: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 0.9rem;
}

.node-document-placeholder {
    padding: 8px;
    background: #f0f0f0;
    border-radius: 4px;
    color: #888;
    text-align: center;
}

.node-document-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 8px;
}

.node-document-title {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
}
```

- [ ] **Step 6: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Manual test**

Run `npm run dev`. On a page with a document block:
1. The file block shows filename (resolved from PB) or "Click to select file"
2. Click to open FilePicker — browse and upload tabs work
3. Select a file — block updates
4. Edit title inline
5. Save — changes persist after reload

- [ ] **Step 8: Commit**

```bash
git add modules/hudozka-writer/src/types.ts modules/hudozka-writer/src/components/FilePicker.tsx modules/hudozka-writer/src/components/FilePicker.css modules/hudozka-writer/src/nodes/DocumentBlock.tsx modules/hudozka-writer/src/nodes/nodes.css
git commit -m "feat: add interactive file block editor with FilePicker"
```

---

### Task 7: Card Grid — Show Page Titles

**Files:**
- Modify: `src/nodes/CardGridBlock.tsx`
- Modify: `src/nodes/nodes.css`

- [ ] **Step 1: Update CardGridBlockView to fetch page titles**

Replace the entire content of `src/nodes/CardGridBlock.tsx`:

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { useState, useEffect } from "react"
import { pb } from "../pb"
import type { PbPage } from "../types"

type ResolvedItem = {
    page: string
    title: string | null
}

function CardGridBlockView({ node }: NodeViewProps) {
    const items = JSON.parse(node.attrs.items || "[]")
    const [resolved, setResolved] = useState<ResolvedItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (items.length === 0) {
            setResolved([])
            return
        }

        setLoading(true)
        Promise.all(
            items.map(async (item: { page: string }) => {
                try {
                    const page = await pb.collection("pages").getOne<PbPage>(item.page)
                    return { page: item.page, title: page.title }
                } catch {
                    return { page: item.page, title: null }
                }
            })
        ).then((results) => {
            setResolved(results)
            setLoading(false)
        })
    }, [node.attrs.items])

    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <div className="node-block-label">
                Card Grid ({items.length})
            </div>
            {loading ? (
                <div className="node-block-info">Loading...</div>
            ) : (
                <ul className="node-cardgrid-list">
                    {resolved.map((item) => (
                        <li key={item.page} className="node-cardgrid-item">
                            {item.title ?? item.page}
                        </li>
                    ))}
                </ul>
            )}
        </NodeViewWrapper>
    )
}

export const CardGridBlock = Node.create({
    name: "cardGridBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            items: { default: "[]" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-card-grid-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-card-grid-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CardGridBlockView)
    },
})
```

- [ ] **Step 2: Add CardGrid list styles**

Append to `src/nodes/nodes.css`:

```css
.node-cardgrid-list {
    margin: 4px 0 0;
    padding-left: 20px;
    font-size: 0.9rem;
}

.node-cardgrid-item {
    color: #444;
    line-height: 1.6;
}
```

- [ ] **Step 3: Verify build passes**

Run:
```bash
cd modules/hudozka-writer && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Manual test**

Run `npm run dev`. Open a page with a card grid block. Verify:
1. Shows "Card Grid (N)" header with count
2. Below it, a bulleted list of resolved page titles
3. If a page ID can't be resolved, shows the raw ID as fallback

- [ ] **Step 5: Commit**

```bash
git add modules/hudozka-writer/src/nodes/CardGridBlock.tsx modules/hudozka-writer/src/nodes/nodes.css
git commit -m "feat: show resolved page titles in card grid block"
```
