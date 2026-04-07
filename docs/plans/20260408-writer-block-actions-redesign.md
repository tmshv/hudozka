# Writer Block Actions Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the block sidebar to show a persistent left-side menu with delete + drag handle on every block, a persistent [+] insert button between blocks, and an outline on the active block.

**Architecture:** Replace the current hover-triggered `BlockActions` (3 buttons: drag, add, delete) with two separate components: `BlockActions` (always-visible vertical sidebar with delete + drag handle) and `BlockInsert` (always-visible [+] button between blocks). Each `NodeViewWrapper` uses a flex row layout: sidebar on the left, block content on the right. DnD uses only the drag handle element, not the full block wrapper. Active block gets a CSS outline.

**Tech Stack:** React, Tiptap, CSS

---

## File Map

| Action | File                                                  | Responsibility                              |
|--------|-------------------------------------------------------|---------------------------------------------|
| Modify | `modules/hudozka-writer/src/components/BlockActions.tsx` | Simplify to delete + drag handle, always visible |
| Rewrite| `modules/hudozka-writer/src/components/BlockActions.css` | Vertical sidebar layout, always visible     |
| Create | `modules/hudozka-writer/src/components/BlockInsert.tsx`  | [+] button that opens BlockMenu             |
| Create | `modules/hudozka-writer/src/components/BlockInsert.css`  | Insert button styles                        |
| Modify | `modules/hudozka-writer/src/nodes/textBlocks.tsx`        | Add BlockInsert, use flex wrapper layout     |
| Modify | `modules/hudozka-writer/src/nodes/ImageBlock.tsx`        | Remove data-drag-handle, add BlockInsert, flex layout |
| Modify | `modules/hudozka-writer/src/nodes/DocumentBlock.tsx`     | Remove data-drag-handle, add BlockInsert, flex layout |
| Modify | `modules/hudozka-writer/src/nodes/EmbedBlock.tsx`        | Add BlockInsert, flex layout                |
| Modify | `modules/hudozka-writer/src/nodes/CardGridBlock.tsx`     | Add BlockInsert, flex layout                |
| Modify | `modules/hudozka-writer/src/components/Editor.css`       | Active block outline styles                 |

---

### Task 1: Simplify BlockActions to delete + drag handle

**Files:**
- Modify: `modules/hudozka-writer/src/components/BlockActions.tsx`
- Rewrite: `modules/hudozka-writer/src/components/BlockActions.css`

- [x] **Step 1: Rewrite BlockActions.tsx**

Replace the entire file with a simplified component — no active state tracking, no menu, always visible, just delete and drag handle:

```tsx
import type { Editor } from "@tiptap/react"
import "./BlockActions.css"

export type BlockActionsProps = {
    editor: Editor
    getPos: () => number | undefined
}

export function BlockActions({ editor, getPos }: BlockActionsProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        const pos = getPos()
        if (typeof pos !== "number") return
        const node = editor.state.doc.nodeAt(pos)
        if (!node) return
        editor.chain().focus().deleteRange({
            from: pos,
            to: pos + node.nodeSize,
        }).run()
    }

    return (
        <div className="block-actions" contentEditable={false}>
            <button
                className="block-action-btn block-action-delete"
                title="Delete block"
                onClick={handleDelete}
            >
                &times;
            </button>
            <div
                className="block-action-btn block-drag-handle"
                data-drag-handle
                draggable
                title="Drag to reorder"
            >
                &#x2807;
            </div>
        </div>
    )
}
```

- [x] **Step 2: Rewrite BlockActions.css**

Replace the entire file. The sidebar is a vertical flex column, always visible, positioned left of the block content via the parent flex row:

```css
.block-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    width: 28px;
    padding-top: 2px;
    user-select: none;
}

.block-action-btn {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    padding: 0;
}

.block-action-btn:hover {
    border-color: #ddd;
    color: #666;
    background: #f5f5f5;
}

.block-action-delete:hover {
    border-color: #c00;
    color: #c00;
    background: #fff0f0;
}

.block-drag-handle {
    cursor: grab;
}

.block-drag-handle:active {
    cursor: grabbing;
}
```

- [x] **Step 3: Verify the editor loads without errors** (skipped - manual browser verification)

Run: open the writer in browser, check there are no console errors. Blocks should show delete and drag buttons to the left (layout will be finalized in Task 3).

- [x] **Step 4: Commit**

```bash
git add modules/hudozka-writer/src/components/BlockActions.tsx modules/hudozka-writer/src/components/BlockActions.css
git commit -m "refactor(writer): simplify BlockActions to always-visible delete + drag handle"
```

---

### Task 2: Create BlockInsert component

**Files:**
- Create: `modules/hudozka-writer/src/components/BlockInsert.tsx`
- Create: `modules/hudozka-writer/src/components/BlockInsert.css`

- [x] **Step 1: Create BlockInsert.tsx**

A [+] button that sits between blocks and opens a `BlockMenu` dropdown:

```tsx
import { useState } from "react"
import type { Editor } from "@tiptap/react"
import { BlockMenu } from "./BlockMenu"
import "./BlockInsert.css"

export type BlockInsertProps = {
    editor: Editor
    getPos: () => number | undefined
}

export function BlockInsert({ editor, getPos }: BlockInsertProps) {
    const [menuOpen, setMenuOpen] = useState(false)

    const insertPos = (() => {
        const pos = getPos()
        if (typeof pos !== "number") return 0
        const node = editor.state.doc.nodeAt(pos)
        return node ? pos + node.nodeSize : 0
    })()

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setMenuOpen(!menuOpen)
    }

    const handleClose = () => {
        setMenuOpen(false)
    }

    return (
        <div className="block-insert" contentEditable={false}>
            <button
                className="block-insert-btn"
                title="Add block"
                onClick={handleToggle}
            >
                +
            </button>
            {menuOpen && (
                <div className="block-insert-menu">
                    <BlockMenu
                        editor={editor}
                        position={insertPos}
                        onClose={handleClose}
                    />
                </div>
            )}
        </div>
    )
}
```

- [x] **Step 2: Create BlockInsert.css**

```css
.block-insert {
    position: relative;
    height: 0;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 28px;
}

.block-insert-btn {
    position: relative;
    top: -1px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: none;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
    padding: 0;
    z-index: 10;
}

.block-insert-btn:hover {
    border-color: #ddd;
    color: #666;
    background: #f5f5f5;
}

.block-insert-menu {
    position: absolute;
    top: 12px;
    left: 56px;
    z-index: 50;
}
```

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/components/BlockInsert.tsx modules/hudozka-writer/src/components/BlockInsert.css
git commit -m "feat(writer): add BlockInsert component for inserting blocks between nodes"
```

---

### Task 3: Update all node views with new layout

**Files:**
- Modify: `modules/hudozka-writer/src/nodes/textBlocks.tsx`
- Modify: `modules/hudozka-writer/src/nodes/ImageBlock.tsx`
- Modify: `modules/hudozka-writer/src/nodes/DocumentBlock.tsx`
- Modify: `modules/hudozka-writer/src/nodes/EmbedBlock.tsx`
- Modify: `modules/hudozka-writer/src/nodes/CardGridBlock.tsx`
- Modify: `modules/hudozka-writer/src/components/Editor.css`
- Modify: `modules/hudozka-writer/src/components/BlockActions.css`

Every block view gets a consistent flex row layout:

```
<NodeViewWrapper className="node-view-block">
    <BlockActions ... />
    <div className="node-view-content">
        ...block body...
    </div>
</NodeViewWrapper>
<BlockInsert ... />
```

- [ ] **Step 1: Add shared layout styles to BlockActions.css**

Append these rules to the end of `BlockActions.css` (they use the `[data-node-view-wrapper]` selector which is already in this file):

```css
[data-node-view-wrapper] {
    position: relative;
}

.node-view-block {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 4px;
}

.node-view-content {
    flex: 1;
    min-width: 0;
}
```

Note: remove the existing `[data-node-view-wrapper] { position: relative; }` rule at the bottom of the file — the new one replaces it.

- [ ] **Step 2: Add active block outline to Editor.css**

Append to `Editor.css`:

```css
.editor-content .tiptap [data-node-view-wrapper].active-block > .node-view-content {
    outline: 2px solid #d0d5dd;
    outline-offset: 2px;
    border-radius: 4px;
}
```

- [ ] **Step 3: Add active block tracking to BlockActions**

We need BlockActions to set a class on its parent `NodeViewWrapper` when the block is active. Update `BlockActions.tsx` to add/remove `active-block` class. Replace the file with:

```tsx
import { useEffect, useCallback } from "react"
import type { Editor } from "@tiptap/react"
import "./BlockActions.css"

export type BlockActionsProps = {
    editor: Editor
    getPos: () => number | undefined
}

export function BlockActions({ editor, getPos }: BlockActionsProps) {
    const getWrapper = useCallback(() => {
        const pos = getPos()
        if (typeof pos !== "number") return null
        const dom = editor.view.nodeDOM(pos)
        if (!dom || !(dom instanceof HTMLElement)) return null
        return dom.closest("[data-node-view-wrapper]") as HTMLElement | null
    }, [editor, getPos])

    useEffect(() => {
        const checkActive = () => {
            const wrapper = getWrapper()
            if (!wrapper) return

            const pos = getPos()
            if (typeof pos !== "number") {
                wrapper.classList.remove("active-block")
                return
            }

            const { from } = editor.state.selection
            const resolved = editor.state.doc.resolve(from)
            if (resolved.depth < 1) {
                wrapper.classList.remove("active-block")
                return
            }

            const blockPos = resolved.before(1)
            if (blockPos === pos) {
                wrapper.classList.add("active-block")
            } else {
                wrapper.classList.remove("active-block")
            }
        }

        const handleBlur = () => {
            const wrapper = getWrapper()
            wrapper?.classList.remove("active-block")
        }

        checkActive()
        editor.on("selectionUpdate", checkActive)
        editor.on("focus", checkActive)
        editor.on("blur", handleBlur)
        return () => {
            editor.off("selectionUpdate", checkActive)
            editor.off("focus", checkActive)
            editor.off("blur", handleBlur)
            const wrapper = getWrapper()
            wrapper?.classList.remove("active-block")
        }
    }, [editor, getPos, getWrapper])

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault()
        const pos = getPos()
        if (typeof pos !== "number") return
        const node = editor.state.doc.nodeAt(pos)
        if (!node) return
        editor.chain().focus().deleteRange({
            from: pos,
            to: pos + node.nodeSize,
        }).run()
    }

    return (
        <div className="block-actions" contentEditable={false}>
            <button
                className="block-action-btn block-action-delete"
                title="Delete block"
                onClick={handleDelete}
            >
                &times;
            </button>
            <div
                className="block-action-btn block-drag-handle"
                data-drag-handle
                draggable
                title="Drag to reorder"
            >
                &#x2807;
            </div>
        </div>
    )
}
```

- [ ] **Step 4: Update textBlocks.tsx**

Replace the entire file. All views get the flex layout with `BlockInsert` after:

```tsx
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import Paragraph from "@tiptap/extension-paragraph"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { BlockActions } from "../components/BlockActions"
import { BlockInsert } from "../components/BlockInsert"

function ParagraphView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"p"> className="node-view-content" as="p" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function HeadingView({ editor, getPos, node }: NodeViewProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tag = `h${node.attrs.level}` as any
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent className="node-view-content" as={tag} />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function BulletListView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"ul"> className="node-view-content" as="ul" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function OrderedListView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"ol"> className="node-view-content" as="ol" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function BlockquoteView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"blockquote"> className="node-view-content" as="blockquote" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function CodeBlockView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block" as="pre">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"code"> className="node-view-content" as="code" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function HorizontalRuleView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
                    <hr />
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
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

- [ ] **Step 5: Update ImageBlock.tsx**

In `ImageBlockView`, wrap in flex layout, remove `data-drag-handle`, add `BlockInsert`:

```tsx
// Change the return in ImageBlockView to:
    return (
        <>
            <NodeViewWrapper className="node-view-block node-image-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
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
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
```

Add import at top: `import { BlockInsert } from "../components/BlockInsert"`

- [ ] **Step 6: Update DocumentBlock.tsx**

Same pattern. Change the return in `DocumentBlockView`:

```tsx
    return (
        <>
            <NodeViewWrapper className="node-view-block node-document-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
                    <div className="node-block-label">File</div>
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
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
```

Add import at top: `import { BlockInsert } from "../components/BlockInsert"`

- [ ] **Step 7: Update EmbedBlock.tsx**

```tsx
function EmbedBlockView({ node, editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block node-readonly-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
                    <div className="node-block-label">Embed</div>
                    <div className="node-block-info">
                        <code>{node.attrs.src}</code>
                    </div>
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}
```

Add import: `import { BlockInsert } from "../components/BlockInsert"`

- [ ] **Step 8: Update CardGridBlock.tsx**

```tsx
    return (
        <>
            <NodeViewWrapper className="node-view-block node-readonly-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
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
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
```

Add import: `import { BlockInsert } from "../components/BlockInsert"`

- [ ] **Step 9: Update nodes.css — remove position: relative from block cards**

The card blocks (`.node-image-block`, `.node-readonly-block`, `.node-document-block`) previously had `position: relative` for absolute-positioned `BlockActions`. That's no longer needed since BlockActions uses flex layout. Remove `position: relative` from these selectors in `nodes.css`. The `margin: 8px 0` should also be removed since spacing is handled by the tiptap `> * + *` rule.

In `nodes.css`, change:

```css
.node-image-block,
.node-readonly-block {
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    margin: 8px 0;
    background: #fafafa;
}
```

to:

```css
.node-image-block,
.node-readonly-block {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    background: #fafafa;
}
```

And change:

```css
.node-document-block {
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    margin: 8px 0;
    background: #fafafa;
}
```

to:

```css
.node-document-block {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    background: #fafafa;
}
```

Note: these classes are now on `NodeViewWrapper` alongside `node-view-block`, so the border/padding/background applies to the entire flex row. Move these visual styles to `.node-view-content` inside those blocks instead. Actually — since these classes are on the `NodeViewWrapper`, the border will wrap the sidebar too. Better approach: move the visual card styles to a nested selector. Change the above to:

```css
.node-image-block > .node-view-content,
.node-readonly-block > .node-view-content,
.node-document-block > .node-view-content {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 12px;
    background: #fafafa;
}
```

Remove the old `.node-image-block, .node-readonly-block` and `.node-document-block` rules entirely.

- [ ] **Step 10: Verify in browser**

Open the writer, check:
1. Every block has delete + drag handle on the left
2. [+] button visible between all blocks
3. Active block has outline
4. Drag handle works for all block types
5. Delete button removes the block
6. [+] opens menu and inserts a new block

- [ ] **Step 11: Commit**

```bash
git add modules/hudozka-writer/src/nodes/textBlocks.tsx modules/hudozka-writer/src/nodes/ImageBlock.tsx modules/hudozka-writer/src/nodes/DocumentBlock.tsx modules/hudozka-writer/src/nodes/EmbedBlock.tsx modules/hudozka-writer/src/nodes/CardGridBlock.tsx modules/hudozka-writer/src/nodes/nodes.css modules/hudozka-writer/src/components/BlockActions.tsx modules/hudozka-writer/src/components/BlockActions.css modules/hudozka-writer/src/components/Editor.css
git commit -m "feat(writer): redesign block sidebar with always-visible actions and insert button"
```
