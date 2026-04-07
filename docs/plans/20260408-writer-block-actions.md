# Writer Block Actions — Inline NodeView Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the block menu (drag handle, add, delete) from a floating external toolbar into each block's NodeView, shown when the block is focused. This fixes broken text block DnD and gives a consistent UX across all block types.

**Architecture:** A shared `BlockActions` React component is rendered inside every block's NodeView. Text blocks (paragraph, heading, lists, blockquote, codeBlock, horizontalRule) get thin custom NodeViews wrapping `NodeViewContent` + `BlockActions`. Existing custom blocks (image, document, embed, cardgrid) add `BlockActions` into their existing NodeViews. The drag handle uses Tiptap's native `data-drag-handle` attribute. The floating `BlockInsert` extension is deleted. Each `BlockActions` instance subscribes to editor selection events and only shows when its block is the active top-level block.

**Tech Stack:** Tiptap 2 (React), ProseMirror, React 18, CSS

---

## File Structure

**New files:**
- `src/components/BlockActions.tsx` — shared block actions menu component
- `src/components/BlockActions.css` — styling for block actions
- `src/nodes/textBlocks.tsx` — all text block NodeViews (Paragraph, Heading, BulletList, OrderedList, Blockquote, CodeBlock, HorizontalRule)

**Modified files:**
- `src/nodes/ImageBlock.tsx` — add BlockActions, remove `data-drag-handle` from wrapper
- `src/nodes/DocumentBlock.tsx` — same
- `src/nodes/EmbedBlock.tsx` — same
- `src/nodes/CardGridBlock.tsx` — same
- `src/nodes/nodes.css` — remove `cursor: grab` from custom block cards
- `src/nodes/index.ts` — export new text block nodes
- `src/components/Editor.tsx` — replace StarterKit nodes with draggable versions, remove BlockInsert

**Deleted files:**
- `src/extensions/BlockInsert.tsx`
- `src/extensions/BlockInsert.css`

---

## CSS Impact Note

`Editor.css` uses descendant selectors like `.editor-content .tiptap h1`, `.editor-content .tiptap blockquote`, etc. Since NodeViews wrap content in a `<div>` + semantic tag via `NodeViewContent as="h1"`, these selectors still match. The spacing rule `.editor-content .tiptap > * + *` targets direct children of `.tiptap` — the NodeView wrapper `<div>`s become those direct children, so spacing is preserved.

---

### Task 1: Create BlockActions component

**Files:**
- Create: `src/components/BlockActions.tsx`
- Create: `src/components/BlockActions.css`

- [x] **Step 1: Create `src/components/BlockActions.css`**

```css
.block-actions {
    position: absolute;
    left: -88px;
    top: 0;
    z-index: 20;
    display: flex;
    gap: 2px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
}

.block-actions.block-actions-visible {
    opacity: 1;
    pointer-events: auto;
}

.block-action-btn {
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
    padding: 0;
}

.block-action-btn:hover {
    border-color: #213547;
    color: #213547;
    background: #f0f4ff;
}

.block-drag-handle {
    cursor: grab;
    letter-spacing: 1px;
}

.block-drag-handle:active {
    cursor: grabbing;
}

.block-action-delete:hover {
    border-color: #c00;
    color: #c00;
    background: #fff0f0;
}

.block-actions-menu {
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
}
```

- [x] **Step 2: Create `src/components/BlockActions.tsx`**

```tsx
import { useState, useEffect, useCallback } from "react"
import type { Editor } from "@tiptap/react"
import { BlockMenu } from "./BlockMenu"
import "./BlockActions.css"

export type BlockActionsProps = {
    editor: Editor
    getPos: () => number | undefined
}

export function BlockActions({ editor, getPos }: BlockActionsProps) {
    const [isActive, setIsActive] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    // Check if this block is top-level (parent is doc, depth 0)
    const isTopLevel = useCallback(() => {
        const pos = getPos()
        if (typeof pos !== "number") return false
        const resolved = editor.state.doc.resolve(pos)
        return resolved.depth === 0
    }, [editor, getPos])

    useEffect(() => {
        if (!isTopLevel()) return

        const checkActive = () => {
            const pos = getPos()
            if (typeof pos !== "number") {
                setIsActive(false)
                return
            }
            const { from } = editor.state.selection
            const resolved = editor.state.doc.resolve(from)
            if (resolved.depth < 1) {
                setIsActive(false)
                return
            }
            const blockPos = resolved.before(1)
            setIsActive(blockPos === pos)
        }

        const handleBlur = () => setIsActive(false)

        checkActive()
        editor.on("selectionUpdate", checkActive)
        editor.on("focus", checkActive)
        editor.on("blur", handleBlur)
        return () => {
            editor.off("selectionUpdate", checkActive)
            editor.off("focus", checkActive)
            editor.off("blur", handleBlur)
        }
    }, [editor, getPos, isTopLevel])

    if (!isTopLevel()) return null

    const visible = isActive || menuOpen

    const handleDelete = () => {
        const pos = getPos()
        if (typeof pos !== "number") return
        const node = editor.state.doc.nodeAt(pos)
        if (!node) return
        editor.chain().focus().deleteRange({
            from: pos,
            to: pos + node.nodeSize,
        }).run()
    }

    const handleToggleMenu = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setMenuOpen(!menuOpen)
    }

    const handleCloseMenu = () => {
        setMenuOpen(false)
    }

    const insertPos = (() => {
        const pos = getPos()
        if (typeof pos !== "number") return 0
        const node = editor.state.doc.nodeAt(pos)
        return node ? pos + node.nodeSize : 0
    })()

    return (
        <div
            className={`block-actions ${visible ? "block-actions-visible" : ""}`}
            contentEditable={false}
        >
            <div
                className="block-action-btn block-drag-handle"
                data-drag-handle
                title="Drag to reorder"
            >
                &#x2807;
            </div>
            <button
                className="block-action-btn"
                title="Add block"
                onClick={handleToggleMenu}
            >
                +
            </button>
            <button
                className="block-action-btn block-action-delete"
                title="Delete block"
                onClick={handleDelete}
            >
                &times;
            </button>
            {menuOpen && (
                <div className="block-actions-menu">
                    <BlockMenu
                        editor={editor}
                        position={insertPos}
                        onClose={handleCloseMenu}
                    />
                </div>
            )}
        </div>
    )
}
```

- [x] **Step 3: Commit**

```bash
git add src/components/BlockActions.tsx src/components/BlockActions.css
git commit -m "feat(writer): add BlockActions component for inline block menus"
```

---

### Task 2: Create text block NodeViews

**Files:**
- Create: `src/nodes/textBlocks.tsx`

All text block types get thin NodeViews: a wrapper with `BlockActions` + `NodeViewContent` using the appropriate semantic HTML tag. Each extends its StarterKit node with `draggable: true`.

- [x] **Step 1: Create `src/nodes/textBlocks.tsx`**

```tsx
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { BlockActions } from "../components/BlockActions"

// Extract StarterKit node types for extension
const { Paragraph, Heading, BulletList, OrderedList, Blockquote, CodeBlock, HorizontalRule } =
    StarterKit.extensions.reduce(
        (acc, ext) => {
            if (["paragraph", "heading", "bulletList", "orderedList", "blockquote", "codeBlock", "horizontalRule"].includes(ext.name)) {
                const key = ext.name.charAt(0).toUpperCase() + ext.name.slice(1)
                acc[key] = ext
            }
            return acc
        },
        {} as Record<string, (typeof StarterKit.extensions)[number]>,
    )

function ParagraphView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as="p" />
        </NodeViewWrapper>
    )
}

function HeadingView({ editor, getPos, node }: NodeViewProps) {
    const tag = `h${node.attrs.level}` as keyof HTMLElementTagNameMap
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as={tag} />
        </NodeViewWrapper>
    )
}

function BulletListView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as="ul" />
        </NodeViewWrapper>
    )
}

function OrderedListView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as="ol" />
        </NodeViewWrapper>
    )
}

function BlockquoteView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as="blockquote" />
        </NodeViewWrapper>
    )
}

function CodeBlockView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper as="pre">
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as="code" />
        </NodeViewWrapper>
    )
}

function HorizontalRuleView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <hr />
        </NodeViewWrapper>
    )
}

export const DraggableParagraph = Paragraph.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(ParagraphView)
    },
})

export const DraggableHeading = Heading.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(HeadingView)
    },
})

export const DraggableBulletList = BulletList.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(BulletListView)
    },
})

export const DraggableOrderedList = OrderedList.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(OrderedListView)
    },
})

export const DraggableBlockquote = Blockquote.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(BlockquoteView)
    },
})

export const DraggableCodeBlock = CodeBlock.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockView)
    },
})

export const DraggableHorizontalRule = HorizontalRule.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(HorizontalRuleView)
    },
})
```

- [x] **Step 2: Export from `src/nodes/index.ts`**

Add to the existing exports:

```ts
export {
    DraggableParagraph,
    DraggableHeading,
    DraggableBulletList,
    DraggableOrderedList,
    DraggableBlockquote,
    DraggableCodeBlock,
    DraggableHorizontalRule,
} from "./textBlocks"
```

- [x] **Step 3: Commit**

```bash
git add src/nodes/textBlocks.tsx src/nodes/index.ts
git commit -m "feat(writer): add draggable NodeViews for text blocks"
```

---

### Task 3: Update existing custom blocks to use BlockActions

**Files:**
- Modify: `src/nodes/ImageBlock.tsx:9-80` (NodeView component)
- Modify: `src/nodes/DocumentBlock.tsx:9-71` (NodeView component)
- Modify: `src/nodes/EmbedBlock.tsx:5-13` (NodeView component)
- Modify: `src/nodes/CardGridBlock.tsx:13-58` (NodeView component)
- Modify: `src/nodes/nodes.css:9-17,71-78` (remove `cursor: grab`)

For each custom block:
1. Import `BlockActions`
2. Remove `data-drag-handle` from `NodeViewWrapper`
3. Add `<BlockActions editor={editor} getPos={getPos} />` as first child inside NodeViewWrapper
4. Add `editor` and `getPos` to the destructured `NodeViewProps`

- [x] **Step 1: Update `ImageBlock.tsx`**

Change the view function signature and NodeViewWrapper:

```tsx
function ImageBlockView({ node, updateAttributes, editor, getPos }: NodeViewProps) {
```

Replace the NodeViewWrapper opening tag — remove `data-drag-handle`:

```tsx
<NodeViewWrapper className="node-image-block">
    <BlockActions editor={editor} getPos={getPos} />
    <div className="node-block-label">Image</div>
```

Add the import at the top:

```tsx
import { BlockActions } from "../components/BlockActions"
```

- [x] **Step 2: Update `DocumentBlock.tsx`**

Same pattern. Change view function signature:

```tsx
function DocumentBlockView({ node, updateAttributes, editor, getPos }: NodeViewProps) {
```

Replace NodeViewWrapper — remove `data-drag-handle`:

```tsx
<NodeViewWrapper className="node-document-block">
    <BlockActions editor={editor} getPos={getPos} />
    <div className="node-block-label">File</div>
```

Add import:

```tsx
import { BlockActions } from "../components/BlockActions"
```

- [x] **Step 3: Update `EmbedBlock.tsx`**

Change view function signature:

```tsx
function EmbedBlockView({ node, editor, getPos }: NodeViewProps) {
```

Replace NodeViewWrapper — remove `data-drag-handle`:

```tsx
<NodeViewWrapper className="node-readonly-block">
    <BlockActions editor={editor} getPos={getPos} />
    <div className="node-block-label">Embed</div>
```

Add import:

```tsx
import { BlockActions } from "../components/BlockActions"
```

- [x] **Step 4: Update `CardGridBlock.tsx`**

Change view function signature:

```tsx
function CardGridBlockView({ node, editor, getPos }: NodeViewProps) {
```

Replace NodeViewWrapper — remove `data-drag-handle`:

```tsx
<NodeViewWrapper className="node-readonly-block">
    <BlockActions editor={editor} getPos={getPos} />
    <div className="node-block-label">Card Grid ({items.length} items)</div>
```

Add import:

```tsx
import { BlockActions } from "../components/BlockActions"
```

- [x] **Step 5: Remove `cursor: grab` from custom block CSS in `nodes.css`**

The drag handle is now in BlockActions. Remove `cursor: grab` from these rules:

In `.node-image-block, .node-readonly-block` (line 9-17): remove `cursor: grab;`

In `.node-document-block` (line 71-78): remove `cursor: grab;`

- [x] **Step 6: Commit**

```bash
git add src/nodes/ImageBlock.tsx src/nodes/DocumentBlock.tsx src/nodes/EmbedBlock.tsx src/nodes/CardGridBlock.tsx src/nodes/nodes.css
git commit -m "feat(writer): use BlockActions in custom block NodeViews"
```

---

### Task 4: Wire up editor, remove BlockInsert

**Files:**
- Modify: `src/components/Editor.tsx:1-64`
- Delete: `src/extensions/BlockInsert.tsx`
- Delete: `src/extensions/BlockInsert.css`

- [x] **Step 1: Update `Editor.tsx` imports and extensions**

Replace the imports:

```tsx
import {
    WriterDocument,
    ImageBlock,
    DocumentBlock,
    EmbedBlock,
    CardGridBlock,
    DraggableParagraph,
    DraggableHeading,
    DraggableBulletList,
    DraggableOrderedList,
    DraggableBlockquote,
    DraggableCodeBlock,
    DraggableHorizontalRule,
} from "../nodes"
```

Remove the BlockInsert import:

```tsx
// DELETE this line:
import { BlockInsert } from "../extensions/BlockInsert"
```

Update the extensions array — disable StarterKit nodes that have draggable replacements, add the replacements, remove BlockInsert:

```tsx
const editor = useEditor({
    extensions: [
        WriterDocument,
        StarterKit.configure({
            document: false,
            paragraph: false,
            heading: false,
            bulletList: false,
            orderedList: false,
            blockquote: false,
            codeBlock: false,
            horizontalRule: false,
        }),
        DraggableParagraph,
        DraggableHeading,
        DraggableBulletList,
        DraggableOrderedList,
        DraggableBlockquote,
        DraggableCodeBlock,
        DraggableHorizontalRule,
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
```

- [x] **Step 2: Delete BlockInsert extension files**

```bash
rm src/extensions/BlockInsert.tsx src/extensions/BlockInsert.css
```

- [x] **Step 3: Commit**

```bash
git add src/components/Editor.tsx src/nodes/index.ts
git add -u src/extensions/BlockInsert.tsx src/extensions/BlockInsert.css
git commit -m "feat(writer): replace floating BlockInsert with inline BlockActions"
```

---

### Task 5: Add `position: relative` to NodeView wrappers

**Files:**
- Modify: `src/nodes/nodes.css`
- Create or modify: `src/components/BlockActions.css` (already created in Task 1)

BlockActions uses `position: absolute` to sit left of the block. Every block's outermost wrapper needs `position: relative`. For custom blocks, they already have styled classes. For text blocks, the `NodeViewWrapper` gets Tiptap's default `data-node-view-wrapper` attribute.

- [ ] **Step 1: Add position: relative to custom block classes in `nodes.css`**

Add `position: relative;` to:
- `.node-image-block, .node-readonly-block`
- `.node-document-block`

- [ ] **Step 2: Add a global rule for all NodeView wrappers in `BlockActions.css`**

Add to `BlockActions.css`:

```css
[data-node-view-wrapper] {
    position: relative;
}
```

This targets all Tiptap NodeView wrappers, ensuring BlockActions can position itself absolutely in any block type.

- [ ] **Step 3: Commit**

```bash
git add src/nodes/nodes.css src/components/BlockActions.css
git commit -m "fix(writer): ensure all block wrappers have position: relative for BlockActions"
```

---

### Task 6: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
cd modules/hudozka-writer && npm run dev
```

- [ ] **Step 2: Verify block actions visibility**

Open the writer in the browser. Click into a paragraph — block actions (drag handle ⠇, +, ×) should appear to the left. Click into a heading — actions move to the heading, disappear from paragraph. Click outside the editor — all actions disappear.

- [ ] **Step 3: Verify drag-and-drop for text blocks**

Create several paragraphs. Grab the ⠇ handle on one and drag it between others. It should move smoothly — no focus loss, no failed drags.

- [ ] **Step 4: Verify drag-and-drop for custom blocks**

Insert an image block. Drag it via the ⠇ handle. It should move just like text blocks. Repeat for file, embed, and card grid blocks.

- [ ] **Step 5: Verify add/delete buttons**

Click + on a block — BlockMenu should appear with block type options. Insert a new block — it should appear after the current block. Click × — the current block should be deleted.

- [ ] **Step 6: Verify nested blocks don't show actions**

Create a bullet list with several items. Only the list itself should show block actions, not individual list items. Create a blockquote — only the blockquote should show actions, not paragraphs inside it.

- [ ] **Step 7: Verify existing CSS still applies**

Check that headings have correct font sizes, blockquotes have left border, code blocks have gray background, lists have proper indentation. The NodeView wrappers should not break any existing styles.
