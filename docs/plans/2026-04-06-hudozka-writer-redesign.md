# Hudozka Writer Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `modules/hudozka-writer/` as a Tiptap-based SPA that edits PocketBase page documents (DocV1 format) with superuser auth, image browse/upload, and save.

**Architecture:** Standalone Vite 8 + React 19.2 SPA. Single Tiptap editor with custom node views for non-text block types (image, document, embed, card-grid). PocketBase JS SDK for auth and CRUD. DocV1 types copied from main project. Markdown stored in text blocks, converted to/from Tiptap JSON via `@tiptap/extension-markdown`.

**Tech Stack:** Vite 8, React 19.2, TypeScript 5.9, Tiptap (latest), PocketBase JS SDK, plain CSS.

**Spec:** `docs/superpowers/specs/2026-04-06-hudozka-writer-redesign.md`

---

### Task 1: Scaffold — wipe old code, install new deps

**Files:**
- Rewrite: `modules/hudozka-writer/package.json`
- Rewrite: `modules/hudozka-writer/tsconfig.json`
- Rewrite: `modules/hudozka-writer/tsconfig.node.json`
- Rewrite: `modules/hudozka-writer/vite.config.ts`
- Rewrite: `modules/hudozka-writer/index.html`
- Delete: `modules/hudozka-writer/.eslintrc.cjs`
- Delete: `modules/hudozka-writer/src/App.css`
- Delete: `modules/hudozka-writer/src/assets/react.svg`
- Delete: `modules/hudozka-writer/public/vite.svg` (if exists)
- Rewrite: `modules/hudozka-writer/src/main.tsx`
- Create: `modules/hudozka-writer/src/App.tsx`
- Rewrite: `modules/hudozka-writer/src/index.css`

- [x] **Step 1: Write `package.json`**

```json
{
  "name": "hudozka-writer",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tiptap/core": "^3.0.0",
    "@tiptap/extension-blockquote": "^3.0.0",
    "@tiptap/extension-bold": "^3.0.0",
    "@tiptap/extension-bullet-list": "^3.0.0",
    "@tiptap/extension-code": "^3.0.0",
    "@tiptap/extension-code-block": "^3.0.0",
    "@tiptap/extension-document": "^3.0.0",
    "@tiptap/extension-hard-break": "^3.0.0",
    "@tiptap/extension-heading": "^3.0.0",
    "@tiptap/extension-horizontal-rule": "^3.0.0",
    "@tiptap/extension-italic": "^3.0.0",
    "@tiptap/extension-link": "^3.0.0",
    "@tiptap/extension-list-item": "^3.0.0",
    "@tiptap/extension-markdown": "^3.0.0",
    "@tiptap/extension-ordered-list": "^3.0.0",
    "@tiptap/extension-paragraph": "^3.0.0",
    "@tiptap/extension-strike": "^3.0.0",
    "@tiptap/extension-text": "^3.0.0",
    "@tiptap/pm": "^3.0.0",
    "@tiptap/react": "^3.0.0",
    "@tiptap/starter-kit": "^3.0.0",
    "pocketbase": "^0.25.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^4.4.0",
    "typescript": "^5.9.0",
    "vite": "^8.0.0"
  }
}
```

- [x] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [x] **Step 3: Write `tsconfig.node.json`** (merged into tsconfig.json, file removed)

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "verbatimModuleSyntax": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [x] **Step 4: Write `vite.config.ts`**

```ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
})
```

- [x] **Step 5: Write `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hudozka Writer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [x] **Step 6: Write `src/index.css`** (minimal reset)

```css
:root {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.5;
    color: #213547;
    background-color: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    min-height: 100vh;
}
```

- [x] **Step 7: Write `src/main.tsx`** (minimal — just mounts App)

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
```

- [x] **Step 8: Write `src/App.tsx`** (placeholder)

```tsx
export function App() {
    return <div>Writer</div>
}
```

- [x] **Step 9: Delete old files**

```bash
cd modules/hudozka-writer
rm -f .eslintrc.cjs src/App.css src/assets/react.svg public/vite.svg src/vite-env.d.ts
rmdir src/assets 2>/dev/null || true
```

- [x] **Step 10: Install deps**

```bash
cd modules/hudozka-writer
rm -rf node_modules package-lock.json
npm install
```

- [x] **Step 11: Verify dev server starts**

```bash
cd modules/hudozka-writer
npx vite --host 127.0.0.1 --port 5173 &
sleep 3
curl -s http://127.0.0.1:5173 | head -5
kill %1
```

Expected: HTML with `<div id="root">` returned.

- [x] **Step 12: Verify `tsc` passes**

```bash
cd modules/hudozka-writer
npx tsc -b --noEmit
```

Expected: no errors.

- [x] **Step 13: Commit**

```bash
git add modules/hudozka-writer/
git commit -m "scaffold hudozka-writer with Vite 8, React 19, TS 5.9, Tiptap"
```

---

### Task 2: PocketBase client + types

**Files:**
- Create: `modules/hudozka-writer/src/pb.ts`
- Create: `modules/hudozka-writer/src/types.ts`

- [x] **Step 1: Write `src/pb.ts`**

```ts
import PocketBase from "pocketbase"

// Default to same origin; override via env for dev
const url = import.meta.env.VITE_PB_URL ?? "http://127.0.0.1:8090"

export const pb = new PocketBase(url)
pb.autoCancellation(false)
```

- [x] **Step 2: Write `src/types.ts`**

Copy DocV1 types and PB record types needed by the writer.

```ts
// -- PocketBase record base --

export type PbRecord = {
    id: string
    collectionId: string
    collectionName: string
    created: string
    updated: string
}

// -- PocketBase collection types --

export type PbImage = PbRecord & {
    file: string
    filename: string
    width: number
    height: number
    blurhash: string
    alt: string
    caption: string
}

export type PbPage = PbRecord & {
    title: string
    slug: string
    excerpt: string
    date: string
    cover: string
    doc: DocV1
    tags: string[]
    draft: boolean
}

// -- DocV1 document format --

export type DocV1BlockText = {
    type: "text"
    id: string
    text: string
}

export type DocV1BlockImage = {
    type: "image"
    id: string
    image: string
    wide: boolean
    caption: string
}

export type DocV1BlockDocument = {
    type: "document"
    id: string
    file: string
    title: string
}

export type DocV1BlockEmbed = {
    type: "embed"
    id: string
    src: string
}

export type DocV1BlockCardGridItem = {
    page: string
    layout: "small" | "medium" | "big"
}

export type DocV1BlockCardGrid = {
    type: "card-grid"
    id: string
    items: DocV1BlockCardGridItem[]
}

export type DocV1Block =
    | DocV1BlockText
    | DocV1BlockImage
    | DocV1BlockDocument
    | DocV1BlockEmbed
    | DocV1BlockCardGrid

export type DocV1 = {
    version: 1
    blocks: DocV1Block[]
}
```

- [x] **Step 3: Verify types compile**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [x] **Step 4: Commit**

```bash
git add modules/hudozka-writer/src/pb.ts modules/hudozka-writer/src/types.ts
git commit -m "add PocketBase client and DocV1 types to writer"
```

---

### Task 3: Login component

**Files:**
- Create: `modules/hudozka-writer/src/components/Login.tsx`
- Create: `modules/hudozka-writer/src/components/Login.css`

- [x] **Step 1: Write `src/components/Login.tsx`**

```tsx
import { useState } from "react"
import type { FormEvent } from "react"
import { pb } from "../pb"
import "./Login.css"

export type LoginProps = {
    onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await pb.collection("_superusers").authWithPassword(email, password)
            onLogin()
        } catch {
            setError("Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Hudozka Writer</h1>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    )
}
```

- [x] **Step 2: Write `src/components/Login.css`**

```css
.login {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 320px;
}

.login-form h1 {
    font-size: 1.4rem;
    margin-bottom: 8px;
}

.login-form input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

.login-form button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background: #213547;
    color: white;
    font-size: 1rem;
    cursor: pointer;
}

.login-form button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.login-error {
    color: #c00;
    font-size: 0.9rem;
}
```

- [x] **Step 3: Verify compiles**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [x] **Step 4: Commit**

```bash
git add modules/hudozka-writer/src/components/
git commit -m "add Login component for PocketBase superuser auth"
```

---

### Task 4: App shell — auth gate + page loader

**Files:**
- Rewrite: `modules/hudozka-writer/src/App.tsx`
- Create: `modules/hudozka-writer/src/App.css`

- [x] **Step 1: Write `src/App.tsx`**

```tsx
import { useState, useEffect, useCallback } from "react"
import { pb } from "./pb"
import { Login } from "./components/Login"
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
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main className="app-main">
                <pre>{JSON.stringify(page.doc, null, 2)}</pre>
            </main>
        </div>
    )
}
```

- [x] **Step 2: Write `src/App.css`**

```css
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.app-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    border-bottom: 1px solid #e0e0e0;
}

.app-title {
    font-weight: 600;
}

.app-slug {
    color: #888;
    font-family: monospace;
}

.app-header button {
    margin-left: auto;
    padding: 4px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
    cursor: pointer;
}

.app-main {
    flex: 1;
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
}

.app-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 100vh;
}

.app-error {
    color: #c00;
}
```

- [x] **Step 3: Verify compiles**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [x] **Step 4: Manual test** (skipped - not automatable)

- [x] **Step 5: Commit**

```bash
git add modules/hudozka-writer/src/App.tsx modules/hudozka-writer/src/App.css
git commit -m "add App shell with auth gate and page loader"
```

---

### Task 5: Serialization — DocV1 <-> Tiptap JSON

**Files:**
- Create: `modules/hudozka-writer/src/lib/serialize.ts`
- Create: `modules/hudozka-writer/src/lib/id.ts`

This is the core data bridge. Converts DocV1Block[] to Tiptap-compatible JSON document and back.

- [x] **Step 1: Write `src/lib/id.ts`**

```ts
export function generateBlockId(): string {
    return crypto.randomUUID().slice(0, 8)
}
```

- [x] **Step 2: Write `src/lib/serialize.ts`**

Tiptap's Markdown extension can parse markdown content directly. For custom nodes (image, document, embed, card-grid), we insert them as custom node JSON between text content groups.

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

// -- DocV1 -> Tiptap JSON --

function textBlockToTiptap(block: DocV1BlockText): JSONContent[] {
    // Return a wrapper node that holds the markdown text for the Markdown extension to parse
    // We use a custom "textBlock" node to preserve the block ID and enable round-tripping
    return [{
        type: "textBlock",
        attrs: { id: block.id },
        content: [{
            type: "paragraph",
            content: [{ type: "text", text: block.text }],
        }],
    }]
}

function imageBlockToTiptap(block: DocV1BlockImage): JSONContent {
    return {
        type: "imageBlock",
        attrs: {
            id: block.id,
            imageId: block.image,
            wide: block.wide,
            caption: block.caption,
        },
    }
}

function documentBlockToTiptap(block: DocV1BlockDocument): JSONContent {
    return {
        type: "documentBlock",
        attrs: {
            id: block.id,
            fileId: block.file,
            title: block.title,
        },
    }
}

function embedBlockToTiptap(block: DocV1BlockEmbed): JSONContent {
    return {
        type: "embedBlock",
        attrs: {
            id: block.id,
            src: block.src,
        },
    }
}

function cardGridBlockToTiptap(block: DocV1BlockCardGrid): JSONContent {
    return {
        type: "cardGridBlock",
        attrs: {
            id: block.id,
            items: JSON.stringify(block.items),
        },
    }
}

export function docToTiptap(doc: DocV1): JSONContent {
    const content: JSONContent[] = []

    for (const block of doc.blocks) {
        switch (block.type) {
        case "text":
            content.push(...textBlockToTiptap(block))
            break
        case "image":
            content.push(imageBlockToTiptap(block))
            break
        case "document":
            content.push(documentBlockToTiptap(block))
            break
        case "embed":
            content.push(embedBlockToTiptap(block))
            break
        case "card-grid":
            content.push(cardGridBlockToTiptap(block))
            break
        }
    }

    return {
        type: "doc",
        content,
    }
}

// -- Tiptap JSON -> DocV1 --

function isCustomBlockNode(node: JSONContent): boolean {
    return ["imageBlock", "documentBlock", "embedBlock", "cardGridBlock"].includes(node.type ?? "")
}

function tiptapTextContent(node: JSONContent): string {
    // Recursively extract text from Tiptap JSON node
    if (node.type === "text") return node.text ?? ""
    if (!node.content) return ""
    return node.content.map(tiptapTextContent).join("")
}

function textNodesToMarkdown(nodes: JSONContent[]): string {
    // For textBlock nodes, extract the raw markdown text
    // For other rich-text nodes, we need to convert back
    // The Markdown extension handles this via editor.storage.markdown.getMarkdown()
    // This is a fallback for direct JSON conversion
    const parts: string[] = []
    for (const node of nodes) {
        if (node.type === "textBlock") {
            // Extract text content from the textBlock wrapper
            parts.push(tiptapTextContent(node))
        } else {
            parts.push(tiptapTextContent(node))
        }
    }
    return parts.join("\n\n")
}

export function tiptapToDoc(content: JSONContent[], getMarkdownForRange?: (from: number, to: number) => string): DocV1 {
    const blocks: DocV1Block[] = []
    let textBuffer: JSONContent[] = []

    function flushTextBuffer() {
        if (textBuffer.length === 0) return
        const text = textNodesToMarkdown(textBuffer)
        if (text.trim()) {
            blocks.push({
                type: "text",
                id: textBuffer[0].attrs?.id ?? generateBlockId(),
                text,
            })
        }
        textBuffer = []
    }

    for (const node of content) {
        if (isCustomBlockNode(node)) {
            flushTextBuffer()
            const attrs = node.attrs ?? {}

            switch (node.type) {
            case "imageBlock":
                blocks.push({
                    type: "image",
                    id: attrs.id ?? generateBlockId(),
                    image: attrs.imageId ?? "",
                    wide: attrs.wide ?? false,
                    caption: attrs.caption ?? "",
                })
                break

            case "documentBlock":
                blocks.push({
                    type: "document",
                    id: attrs.id ?? generateBlockId(),
                    file: attrs.fileId ?? "",
                    title: attrs.title ?? "",
                })
                break

            case "embedBlock":
                blocks.push({
                    type: "embed",
                    id: attrs.id ?? generateBlockId(),
                    src: attrs.src ?? "",
                })
                break

            case "cardGridBlock":
                blocks.push({
                    type: "card-grid",
                    id: attrs.id ?? generateBlockId(),
                    items: JSON.parse(attrs.items ?? "[]"),
                })
                break
            }
        } else {
            textBuffer.push(node)
        }
    }

    flushTextBuffer()

    return { version: 1, blocks }
}
```

**Note:** The actual markdown serialization in the save path will use Tiptap's `editor.storage.markdown.getMarkdown()` to get proper markdown from the editor. The `tiptapToDoc` function handles the structural conversion (splitting at custom nodes), and the Editor component will handle the markdown extraction per text range. This will be refined in Task 7 when wiring the editor.

- [x] **Step 3: Verify compiles**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [x] **Step 4: Commit**

```bash
git add modules/hudozka-writer/src/lib/
git commit -m "add DocV1 <-> Tiptap serialization layer"
```

---

### Task 6: Custom Tiptap nodes

**Files:**
- Create: `modules/hudozka-writer/src/nodes/ImageBlock.tsx`
- Create: `modules/hudozka-writer/src/nodes/DocumentBlock.tsx`
- Create: `modules/hudozka-writer/src/nodes/EmbedBlock.tsx`
- Create: `modules/hudozka-writer/src/nodes/CardGridBlock.tsx`
- Create: `modules/hudozka-writer/src/nodes/WriterDocument.ts`
- Create: `modules/hudozka-writer/src/nodes/TextBlock.ts`
- Create: `modules/hudozka-writer/src/nodes/index.ts`
- Create: `modules/hudozka-writer/src/nodes/nodes.css`

- [ ] **Step 1a: Write `src/nodes/WriterDocument.ts`** — custom Document node that allows our block types

```ts
import { Node } from "@tiptap/core"

export const WriterDocument = Node.create({
    name: "doc",
    topNode: true,
    content: "(textBlock | imageBlock | documentBlock | embedBlock | cardGridBlock)+",
})
```

- [ ] **Step 1b: Write `src/nodes/TextBlock.ts`** — wraps text content with a block ID for round-tripping

```ts
import { Node, mergeAttributes } from "@tiptap/core"

export const TextBlock = Node.create({
    name: "textBlock",
    group: "block",
    content: "block+",

    addAttributes() {
        return {
            id: { default: null },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-text-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-text-block": "" }),
            0,
        ]
    },
})
```

- [ ] **Step 2: Write `src/nodes/ImageBlock.tsx`**

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { pb } from "../pb"
import type { PbImage } from "../types"
import { useState, useEffect } from "react"

function ImageBlockView({ node, updateAttributes }: NodeViewProps) {
    const { imageId, wide, caption } = node.attrs
    const [thumbnail, setThumbnail] = useState<string | null>(null)

    useEffect(() => {
        if (!imageId) return
        pb.collection("images").getOne<PbImage>(imageId).then((img) => {
            const url = pb.files.getURL(img, img.file, { thumb: "300x200" })
            setThumbnail(url)
        }).catch(() => {
            setThumbnail(null)
        })
    }, [imageId])

    return (
        <NodeViewWrapper className="node-image-block" data-drag-handle>
            <div className="node-block-label">Image</div>
            {thumbnail ? (
                <img src={thumbnail} alt={caption || "image"} className="node-image-thumb" />
            ) : (
                <div className="node-image-placeholder">
                    {imageId ? "Loading..." : "No image selected"}
                </div>
            )}
            <div className="node-image-controls">
                <label>
                    <input
                        type="checkbox"
                        checked={wide}
                        onChange={(e) => updateAttributes({ wide: e.target.checked })}
                    />
                    Wide
                </label>
                <input
                    type="text"
                    placeholder="Caption"
                    value={caption || ""}
                    onChange={(e) => updateAttributes({ caption: e.target.value })}
                    className="node-image-caption"
                />
            </div>
        </NodeViewWrapper>
    )
}

export const ImageBlock = Node.create({
    name: "imageBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            imageId: { default: "" },
            wide: { default: false },
            caption: { default: "" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-image-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-image-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageBlockView)
    },
})
```

- [ ] **Step 3: Write `src/nodes/DocumentBlock.tsx`** (read-only)

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"

function DocumentBlockView({ node }: NodeViewProps) {
    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <div className="node-block-label">Document</div>
            <div className="node-block-info">
                <strong>{node.attrs.title || "Untitled"}</strong>
                <code>{node.attrs.fileId}</code>
            </div>
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

- [ ] **Step 4: Write `src/nodes/EmbedBlock.tsx`** (read-only)

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"

function EmbedBlockView({ node }: NodeViewProps) {
    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <div className="node-block-label">Embed</div>
            <div className="node-block-info">
                <code>{node.attrs.src}</code>
            </div>
        </NodeViewWrapper>
    )
}

export const EmbedBlock = Node.create({
    name: "embedBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            src: { default: "" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-embed-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-embed-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmbedBlockView)
    },
})
```

- [ ] **Step 5: Write `src/nodes/CardGridBlock.tsx`** (read-only)

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"

function CardGridBlockView({ node }: NodeViewProps) {
    const items = JSON.parse(node.attrs.items || "[]")
    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <div className="node-block-label">Card Grid</div>
            <div className="node-block-info">
                {items.length} item{items.length !== 1 ? "s" : ""}
            </div>
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

- [ ] **Step 6: Write `src/nodes/nodes.css`**

```css
.node-block-label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
    margin-bottom: 4px;
}

.node-image-block,
.node-readonly-block {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    margin: 8px 0;
    background: #fafafa;
    cursor: grab;
}

.node-image-thumb {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
    object-fit: cover;
}

.node-image-placeholder {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 4px;
    color: #888;
}

.node-image-controls {
    display: flex;
    gap: 12px;
    align-items: center;
    margin-top: 8px;
}

.node-image-caption {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
}

.node-block-info {
    display: flex;
    gap: 8px;
    align-items: center;
}

.node-block-info code {
    font-size: 0.8rem;
    color: #666;
}
```

- [ ] **Step 7: Write `src/nodes/index.ts`** (barrel export)

```ts
export { WriterDocument } from "./WriterDocument"
export { TextBlock } from "./TextBlock"
export { ImageBlock } from "./ImageBlock"
export { DocumentBlock } from "./DocumentBlock"
export { EmbedBlock } from "./EmbedBlock"
export { CardGridBlock } from "./CardGridBlock"
```

- [ ] **Step 8: Verify compiles**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [ ] **Step 9: Commit**

```bash
git add modules/hudozka-writer/src/nodes/
git commit -m "add custom Tiptap nodes for DocV1 block types"
```

---

### Task 7: Editor component + toolbar + save

**Files:**
- Create: `modules/hudozka-writer/src/components/Editor.tsx`
- Create: `modules/hudozka-writer/src/components/Editor.css`
- Create: `modules/hudozka-writer/src/components/Toolbar.tsx`
- Create: `modules/hudozka-writer/src/components/Toolbar.css`
- Modify: `modules/hudozka-writer/src/App.tsx` — replace JSON dump with Editor

- [ ] **Step 1: Write `src/components/Toolbar.tsx`**

```tsx
import type { Editor } from "@tiptap/react"
import "./Toolbar.css"

export type ToolbarProps = {
    editor: Editor | null
    onSave: () => void
    saving: boolean
}

export function Toolbar({ editor, onSave, saving }: ToolbarProps) {
    if (!editor) return null

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

            <div className="toolbar-group toolbar-save">
                <button onClick={onSave} disabled={saving} className="toolbar-save-btn">
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    )
}
```

- [ ] **Step 2: Write `src/components/Toolbar.css`**

```css
.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 8px 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
}

.toolbar-group {
    display: flex;
    gap: 2px;
}

.toolbar button {
    padding: 4px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
    min-width: 32px;
}

.toolbar button:hover {
    background: #f0f0f0;
}

.toolbar button.active {
    background: #213547;
    color: white;
    border-color: #213547;
}

.toolbar-save {
    margin-left: auto;
}

.toolbar-save-btn {
    background: #213547 !important;
    color: white !important;
    border-color: #213547 !important;
    padding: 4px 16px !important;
}

.toolbar-save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed !important;
}
```

- [ ] **Step 3: Write `src/components/Editor.tsx`**

```tsx
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "@tiptap/extension-markdown"
import Link from "@tiptap/extension-link"
import { useState, useCallback } from "react"
import { pb } from "../pb"
import { docToTiptap, tiptapToDoc } from "../lib/serialize"
import { Toolbar } from "./Toolbar"
import {
    WriterDocument,
    TextBlock,
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
                document: false, // replaced by WriterDocument
            }),
            Markdown,
            Link.configure({ openOnClick: false }),
            TextBlock,
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
```

- [ ] **Step 4: Write `src/components/Editor.css`**

```css
.editor {
    width: 100%;
}

.editor-content .tiptap {
    outline: none;
    min-height: 400px;
}

.editor-content .tiptap > * + * {
    margin-top: 0.75em;
}

.editor-content .tiptap h1 {
    font-size: 2rem;
}

.editor-content .tiptap h2 {
    font-size: 1.5rem;
}

.editor-content .tiptap h3 {
    font-size: 1.25rem;
}

.editor-content .tiptap blockquote {
    border-left: 3px solid #e0e0e0;
    padding-left: 1rem;
    color: #666;
}

.editor-content .tiptap pre {
    background: #f5f5f5;
    border-radius: 4px;
    padding: 12px;
    font-family: monospace;
}

.editor-content .tiptap code {
    background: #f0f0f0;
    border-radius: 2px;
    padding: 0.1em 0.3em;
    font-size: 0.9em;
}

.editor-content .tiptap hr {
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 1.5em 0;
}

.editor-content .tiptap a {
    color: #2563eb;
    text-decoration: underline;
}

.editor-content .tiptap ul,
.editor-content .tiptap ol {
    padding-left: 1.5em;
}
```

- [ ] **Step 5: Update `src/App.tsx`** — replace JSON dump with Editor

Replace the `<pre>` tag in the return statement with the Editor component:

```tsx
// Add import at top:
import { Editor } from "./components/Editor"

// Replace the final return block (the one with <main>) with:
    return (
        <div className="app">
            <header className="app-header">
                <span className="app-title">{page.title}</span>
                <span className="app-slug">/{page.slug}</span>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main className="app-main">
                <Editor page={page} />
            </main>
        </div>
    )
```

- [ ] **Step 6: Verify compiles**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [ ] **Step 7: Manual test** — run dev server, login, load a page. Verify:
- Text content renders in editor and is editable
- Custom blocks (image, document, embed, card-grid) show as styled cards
- Toolbar buttons toggle formatting
- Save button sends updated doc to PocketBase

- [ ] **Step 8: Commit**

```bash
git add modules/hudozka-writer/src/components/ modules/hudozka-writer/src/App.tsx
git commit -m "add Tiptap editor with toolbar and save to PocketBase"
```

---

### Task 8: Image picker — browse + upload

**Files:**
- Create: `modules/hudozka-writer/src/components/ImagePicker.tsx`
- Create: `modules/hudozka-writer/src/components/ImagePicker.css`
- Modify: `modules/hudozka-writer/src/nodes/ImageBlock.tsx` — add "Pick image" button that opens picker

- [ ] **Step 1: Write `src/components/ImagePicker.tsx`**

```tsx
import { useState, useEffect, useRef } from "react"
import { pb } from "../pb"
import type { PbImage } from "../types"
import "./ImagePicker.css"

export type ImagePickerProps = {
    onSelect: (imageId: string) => void
    onClose: () => void
}

export function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
    const [images, setImages] = useState<PbImage[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [tab, setTab] = useState<"browse" | "upload">("browse")
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadImages(page)
    }, [page])

    async function loadImages(p: number) {
        setLoading(true)
        try {
            const result = await pb.collection("images").getList<PbImage>(p, 20, {
                sort: "-created",
            })
            setImages(result.items)
            setTotalPages(result.totalPages)
        } catch (err) {
            console.error("Failed to load images:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpload() {
        const file = fileRef.current?.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const record = await pb.collection("images").create<PbImage>({
                file,
                filename: file.name,
                width: 0,
                height: 0,
                alt: "",
                caption: "",
                blurhash: "",
            })
            onSelect(record.id)
        } catch (err) {
            console.error("Upload failed:", err)
            alert("Upload failed. Check console.")
        } finally {
            setUploading(false)
        }
    }

    function getThumbUrl(img: PbImage): string {
        return pb.files.getURL(img, img.file, { thumb: "150x150" })
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
                            <div className="picker-grid">
                                {images.map((img) => (
                                    <button
                                        key={img.id}
                                        className="picker-thumb"
                                        onClick={() => onSelect(img.id)}
                                    >
                                        <img src={getThumbUrl(img)} alt={img.alt || img.filename} />
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
                        <input type="file" accept="image/*" ref={fileRef} />
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

- [ ] **Step 2: Write `src/components/ImagePicker.css`**

```css
.picker-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}

.picker {
    background: white;
    border-radius: 8px;
    width: 600px;
    max-width: 90vw;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.picker-header {
    display: flex;
    gap: 4px;
    padding: 8px;
    border-bottom: 1px solid #e0e0e0;
}

.picker-header button {
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
}

.picker-header button.active {
    background: #213547;
    color: white;
    border-color: #213547;
}

.picker-close {
    margin-left: auto !important;
    font-size: 1.2rem;
}

.picker-browse {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
}

.picker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
}

.picker-thumb {
    border: 2px solid transparent;
    border-radius: 4px;
    padding: 0;
    background: none;
    cursor: pointer;
    overflow: hidden;
    aspect-ratio: 1;
}

.picker-thumb:hover {
    border-color: #213547;
}

.picker-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.picker-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 8px;
}

.picker-pagination button {
    padding: 4px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
}

.picker-pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.picker-loading {
    text-align: center;
    padding: 40px;
    color: #888;
}

.picker-upload {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    align-items: flex-start;
}

.picker-upload button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    background: #213547;
    color: white;
    cursor: pointer;
}

.picker-upload button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
```

- [ ] **Step 3: Update `src/nodes/ImageBlock.tsx`** — add "Pick image" button

Add a state for showing the picker and a button to trigger it. Update the `ImageBlockView` component:

```tsx
// Replace the ImageBlockView function with:

function ImageBlockView({ node, updateAttributes }: NodeViewProps) {
    const { imageId, wide, caption } = node.attrs
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (!imageId) return
        pb.collection("images").getOne<PbImage>(imageId).then((img) => {
            const url = pb.files.getURL(img, img.file, { thumb: "300x200" })
            setThumbnail(url)
        }).catch(() => {
            setThumbnail(null)
        })
    }, [imageId])

    function handleSelect(newImageId: string) {
        updateAttributes({ imageId: newImageId })
        setShowPicker(false)
    }

    return (
        <NodeViewWrapper className="node-image-block" data-drag-handle>
            <div className="node-block-label">Image</div>
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt={caption || "image"}
                    className="node-image-thumb"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                />
            ) : (
                <div
                    className="node-image-placeholder"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                >
                    {imageId ? "Loading..." : "Click to select image"}
                </div>
            )}
            <div className="node-image-controls">
                <label>
                    <input
                        type="checkbox"
                        checked={wide}
                        onChange={(e) => updateAttributes({ wide: e.target.checked })}
                    />
                    Wide
                </label>
                <input
                    type="text"
                    placeholder="Caption"
                    value={caption || ""}
                    onChange={(e) => updateAttributes({ caption: e.target.value })}
                    className="node-image-caption"
                />
                <button
                    className="node-image-pick-btn"
                    onClick={() => setShowPicker(true)}
                >
                    Pick
                </button>
            </div>
            {showPicker && (
                <ImagePicker
                    onSelect={handleSelect}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </NodeViewWrapper>
    )
}

// Add import at top of ImageBlock.tsx:
import { ImagePicker } from "../components/ImagePicker"
```

Add to `src/nodes/nodes.css`:

```css
.node-image-pick-btn {
    padding: 2px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 0.85rem;
}
```

- [ ] **Step 4: Verify compiles**

```bash
cd modules/hudozka-writer && npx tsc -b --noEmit
```

- [ ] **Step 5: Manual test** — load a page with image blocks. Verify:
- Image thumbnails display
- Click image or "Pick" button opens picker modal
- Browse tab shows thumbnails from PB
- Upload tab can upload a new image
- Selecting an image updates the block

- [ ] **Step 6: Commit**

```bash
git add modules/hudozka-writer/src/components/ImagePicker.tsx modules/hudozka-writer/src/components/ImagePicker.css modules/hudozka-writer/src/nodes/ImageBlock.tsx modules/hudozka-writer/src/nodes/nodes.css
git commit -m "add image picker with browse and upload"
```

---

### Task 9: Integration refinement + final verification

**Files:**
- May modify: `modules/hudozka-writer/src/lib/serialize.ts`
- May modify: `modules/hudozka-writer/src/components/Editor.tsx`

- [ ] **Step 1: End-to-end test**

Run dev server. Test full flow:
1. Open `http://localhost:5173` → see login form
2. Login with PB superuser credentials → see "add ?page=slug" message
3. Navigate to `?page=<existing-slug>` → page loads, editor renders with blocks
4. Edit text content → formatting buttons work
5. Click on image block → picker opens, can browse/upload
6. Click Save → verify in PB admin that `doc` field updated
7. Reload page → changes persisted

- [ ] **Step 2: Fix serialization issues found during testing**

The Markdown extension integration may need adjustment. Key things to verify:
- Text blocks round-trip correctly (markdown in → edit → markdown out)
- Custom nodes don't get lost during editing
- Block order is preserved after save

If `@tiptap/extension-markdown` doesn't work well with custom nodes, fall back to storing HTML in text blocks and converting with a simple HTML→markdown step. Adjust `serialize.ts` accordingly.

- [ ] **Step 3: Verify build passes**

```bash
cd modules/hudozka-writer
npm run build
```

Expected: Build succeeds, output in `dist/`.

- [ ] **Step 4: Commit any fixes**

```bash
git add modules/hudozka-writer/
git commit -m "fix serialization and integration issues in writer"
```

---

## Notes for implementer

### PocketBase superuser auth
Use `pb.collection("_superusers").authWithPassword(email, password)` — the collection name is `_superusers` (with underscore prefix), not `users`.

### Tiptap Markdown extension
The `@tiptap/extension-markdown` extension allows setting `contentType: "markdown"` on editor init and provides `editor.storage.markdown.getMarkdown()` for extraction. If this doesn't play well with custom atom nodes (imageBlock, etc.), an alternative approach:
- Store text blocks as HTML instead of markdown
- Use the editor's `getHTML()` method
- Accept that DocV1 text blocks will contain HTML (the main site already converts markdown → HTML in factory.ts, so HTML storage works too)

### Image upload
The PB `images` collection may have required fields (width, height, blurhash) that can't be set from the browser. If upload fails due to validation, adjust the create call to omit those fields or set sensible defaults. The PB admin may need schema adjustment.

### Tiptap Document node
StarterKit includes a `Document` node. Since we use `TextBlock` as a wrapper, the Tiptap doc structure is: `doc > (textBlock | imageBlock | documentBlock | ...)`. Make sure `StarterKit`'s `document` extension is configured to allow our custom top-level block nodes via the `content` property, or disable it and use a custom Document node with `content: "(textBlock | imageBlock | documentBlock | embedBlock | cardGridBlock)+"`.
