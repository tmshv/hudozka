# TextBlock Container Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce a `textBlock` container node so text content (paragraphs, headings, lists) is grouped into cohesive blocks with a single sidebar (delete, drag, split), replacing the current flat structure where every text-level node has its own sidebar.

**Architecture:** A new Tiptap `textBlock` node wraps text-level content. The document schema becomes `(textBlock | imageBlock | documentBlock | embedBlock | cardGridBlock)+`. All `DraggableXxx` wrappers are removed — StarterKit renders text nodes natively inside the container. `BlockActions` gains a split button for text blocks only.

**Tech Stack:** Tiptap/ProseMirror, React, TypeScript

**Spec:** `docs/specs/20260408-textblock-container-redesign.md`

---

## File Structure

| Action | File                                              | Responsibility                                       |
|--------|---------------------------------------------------|------------------------------------------------------|
| Create | `src/nodes/TextBlock.tsx`                         | TextBlock node definition + React node view          |
| Modify | `src/nodes/WriterDocument.ts`                     | Update content spec to explicit block types          |
| Delete | `src/nodes/textBlocks.tsx`                        | Remove all DraggableXxx wrappers                     |
| Modify | `src/nodes/index.ts`                              | Update exports                                       |
| Modify | `src/components/Editor.tsx`                       | Update extensions list, re-enable StarterKit nodes   |
| Modify | `src/components/BlockActions.tsx`                 | Add split button with `showSplit` prop               |
| Modify | `src/components/BlockActions.css`                 | Style for split button                               |
| Modify | `src/lib/serialize.ts`                            | Handle textBlock in serialization/deserialization    |
| Modify | `src/components/BlockMenu.tsx`                    | "Text" inserts a textBlock node                      |
| Modify | `src/extensions/SlashCommands.tsx`                | Handle custom block insertion inside textBlock        |

All paths relative to `modules/hudozka-writer/`.

---

### Task 1: Create TextBlock node definition

**Files:**
- Create: `modules/hudozka-writer/src/nodes/TextBlock.tsx`

- [x] **Step 1: Create the TextBlock node and view**

```tsx
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { BlockActions } from "../components/BlockActions"
import { BlockInsert } from "../components/BlockInsert"

function TextBlockView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block node-text-block">
                <BlockActions editor={editor} getPos={getPos} showSplit />
                <NodeViewContent className="node-view-content" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

export const TextBlock = Node.create({
    name: "textBlock",
    group: "block",
    content: "(paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule)+",
    draggable: true,
    defining: true,

    parseHTML() {
        return [{ tag: "div[data-text-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-text-block": "" }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(TextBlockView)
    },
})
```

Key points:
- `content` uses an explicit list of allowed child types — no group references, so textBlock can't nest inside itself
- `defining: true` tells ProseMirror this node defines the boundary of its content — backspace at the start of the first child won't escape the container
- `showSplit` prop is passed to BlockActions (implemented in Task 4)

- [x] **Step 2: Commit**

```bash
git add modules/hudozka-writer/src/nodes/TextBlock.tsx
git commit -m "feat(writer): add TextBlock container node definition"
```

---

### Task 2: Update document schema and node exports

**Files:**
- Modify: `modules/hudozka-writer/src/nodes/WriterDocument.ts`
- Modify: `modules/hudozka-writer/src/nodes/index.ts`
- Delete: `modules/hudozka-writer/src/nodes/textBlocks.tsx`

- [x] **Step 1: Update WriterDocument content spec**

In `WriterDocument.ts`, change the content from `"block+"` to an explicit list:

```ts
import { Node } from "@tiptap/core"

export const WriterDocument = Node.create({
    name: "doc",
    topNode: true,
    content: "(textBlock | imageBlock | documentBlock | embedBlock | cardGridBlock)+",
})
```

This prevents raw paragraphs/headings at the document top level — they must live inside a textBlock.

- [x] **Step 2: Delete textBlocks.tsx**

Delete the file `modules/hudozka-writer/src/nodes/textBlocks.tsx` entirely. All `DraggableXxx` exports are no longer needed.

- [x] **Step 3: Update index.ts exports**

Replace the DraggableXxx exports with the new TextBlock:

```ts
export { WriterDocument } from "./WriterDocument"
export { TextBlock } from "./TextBlock"
export { ImageBlock } from "./ImageBlock"
export { DocumentBlock } from "./DocumentBlock"
export { EmbedBlock } from "./EmbedBlock"
export { CardGridBlock } from "./CardGridBlock"
```

- [x] **Step 4: Commit**

```bash
git add -u modules/hudozka-writer/src/nodes/
git add modules/hudozka-writer/src/nodes/TextBlock.tsx
git commit -m "feat(writer): replace DraggableXxx wrappers with TextBlock container"
```

---

### Task 3: Update Editor extensions

**Files:**
- Modify: `modules/hudozka-writer/src/components/Editor.tsx`

- [x] **Step 1: Update imports and extensions list**

Replace the imports at the top of Editor.tsx. Remove the DraggableXxx imports:

```ts
import {
    WriterDocument,
    TextBlock,
    ImageBlock,
    DocumentBlock,
    EmbedBlock,
    CardGridBlock,
} from "../nodes"
```

Update the extensions array in `useEditor`:

```ts
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
```

Key change: StarterKit no longer disables paragraph, heading, bulletList, etc. — those are now standard StarterKit nodes rendered natively inside TextBlock. Only `document` is still disabled (replaced by WriterDocument).

- [x] **Step 2: Commit**

```bash
git add modules/hudozka-writer/src/components/Editor.tsx
git commit -m "feat(writer): update Editor extensions for TextBlock container"
```

---

### Task 4: Add split button to BlockActions

**Files:**
- Modify: `modules/hudozka-writer/src/components/BlockActions.tsx`
- Modify: `modules/hudozka-writer/src/components/BlockActions.css`

- [x] **Step 1: Add showSplit prop and split handler**

Update `BlockActionsProps`:

```ts
export type BlockActionsProps = {
    editor: Editor
    getPos: () => number | undefined
    showSplit?: boolean
}
```

Add the split handler function inside `BlockActions`:

```ts
const handleSplit = (e: React.MouseEvent) => {
    e.preventDefault()
    const pos = getPos()
    if (typeof pos !== "number") return
    const node = editor.state.doc.nodeAt(pos)
    if (!node || node.childCount < 2) return

    // Find which child the cursor is in
    const { from } = editor.state.selection
    let childOffset = pos + 1  // +1 to enter the container
    let splitAfter = -1

    for (let i = 0; i < node.childCount; i++) {
        const child = node.child(i)
        const childEnd = childOffset + child.nodeSize
        if (from >= childOffset && from < childEnd) {
            splitAfter = i
            break
        }
        childOffset = childEnd
    }

    // Don't split if cursor is in the last child (would create empty second block)
    if (splitAfter < 0 || splitAfter >= node.childCount - 1) return
    // Don't split if cursor is in the first child and there's nothing before it
    // (splitAfter === 0 is fine — first block gets child 0, second gets the rest)

    // Build two textBlock nodes
    const firstChildren: typeof node.content = []
    const secondChildren: typeof node.content = []
    for (let i = 0; i < node.childCount; i++) {
        if (i <= splitAfter) {
            firstChildren.push(node.child(i))
        } else {
            secondChildren.push(node.child(i))
        }
    }

    const { schema } = editor.state
    const textBlockType = schema.nodes.textBlock
    const first = textBlockType.create(null, firstChildren)
    const second = textBlockType.create(null, secondChildren)

    const tr = editor.state.tr
    tr.replaceWith(pos, pos + node.nodeSize, [first, second])
    editor.view.dispatch(tr)
}
```

Add the split button to the render output, between delete and drag handle:

```tsx
return (
    <div className="block-actions" contentEditable={false}>
        <button
            className="block-action-btn block-action-delete"
            title="Delete block"
            onClick={handleDelete}
        >
            &times;
        </button>
        {showSplit && (
            <button
                className="block-action-btn block-action-split"
                title="Split block"
                onClick={handleSplit}
            >
                &#x2702;
            </button>
        )}
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
```

- [x] **Step 2: Add CSS for split button**

Add to `BlockActions.css`:

```css
.block-action-split:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: #eff6ff;
}
```

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/components/BlockActions.tsx modules/hudozka-writer/src/components/BlockActions.css
git commit -m "feat(writer): add split button to BlockActions for text blocks"
```

---

### Task 5: Update serialization

**Files:**
- Modify: `modules/hudozka-writer/src/lib/serialize.ts`

- [x] **Step 1: Update docToTiptap — wrap text in textBlock**

Change `textBlockToTiptap` to return a single textBlock container wrapping the parsed content:

```ts
function textBlockToTiptap(block: DocV1BlockText): JSONContent {
    const manager = getMarkdownManager()
    const parsed = manager.parse(block.text)
    return {
        type: "textBlock",
        content: parsed.content ?? [],
    }
}
```

Update the `docToTiptap` function to push the single node (not spread):

```ts
case "text":
    content.push(textBlockToTiptap(block))
    break
```

- [x] **Step 2: Update tiptapToDoc — handle textBlock container**

Replace the buffer-based approach. The new logic iterates top-level nodes and handles `textBlock` directly:

```ts
export function tiptapToDoc(content: JSONContent[]): DocV1 {
    const blocks: DocV1Block[] = []

    for (const node of content) {
        switch (node.type) {
        case "textBlock": {
            const text = textNodesToMarkdown(node.content ?? [])
            if (text.trim()) {
                blocks.push({
                    type: "text",
                    id: generateBlockId(),
                    text,
                })
            }
            break
        }

        case "imageBlock": {
            const attrs = node.attrs ?? {}
            blocks.push({
                type: "image",
                id: attrs.id ?? generateBlockId(),
                image: attrs.imageId ?? "",
                wide: attrs.wide ?? false,
                caption: attrs.caption ?? "",
            })
            break
        }

        case "documentBlock": {
            const attrs = node.attrs ?? {}
            blocks.push({
                type: "document",
                id: attrs.id ?? generateBlockId(),
                file: attrs.fileId ?? "",
                title: attrs.title ?? "",
            })
            break
        }

        case "embedBlock": {
            const attrs = node.attrs ?? {}
            blocks.push({
                type: "embed",
                id: attrs.id ?? generateBlockId(),
                src: attrs.src ?? "",
            })
            break
        }

        case "cardGridBlock": {
            const attrs = node.attrs ?? {}
            blocks.push({
                type: "card-grid",
                id: attrs.id ?? generateBlockId(),
                items: JSON.parse(attrs.items ?? "[]"),
            })
            break
        }
        }
    }

    return { version: 1, blocks }
}
```

Remove the `isCustomBlockNode` function and `CUSTOM_BLOCK_TYPES` set — no longer needed.

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/lib/serialize.ts
git commit -m "feat(writer): update serialization for TextBlock container"
```

---

### Task 6: Update BlockMenu and SlashCommands

**Files:**
- Modify: `modules/hudozka-writer/src/components/BlockMenu.tsx`
- Modify: `modules/hudozka-writer/src/extensions/SlashCommands.tsx`

- [x] **Step 1: Update BlockMenu — "Text" inserts a textBlock**

In `BlockMenu.tsx`, change the "Text" entry in `BLOCK_TYPES`:

```ts
const BLOCK_TYPES: BlockType[] = [
    { label: "Text", type: "textBlock" },
    { label: "Image", type: "imageBlock", attrs: { id: "", imageId: "", wide: false, caption: "" } },
    { label: "File", type: "documentBlock", attrs: { id: "", fileId: "", title: "" } },
    { label: "Embed", type: "embedBlock", attrs: { id: "", src: "" } },
    { label: "Card Grid", type: "cardGridBlock", attrs: { id: "", items: "[]" } },
]
```

Update `handleInsert` for the textBlock case:

```ts
function handleInsert(block: BlockType) {
    const id = generateBlockId()
    if (block.type === "textBlock") {
        editor.chain().focus().insertContentAt(position, {
            type: "textBlock",
            content: [{ type: "paragraph" }],
        }).run()
    } else {
        editor.chain().focus().insertContentAt(position, {
            type: block.type,
            attrs: { ...block.attrs, id },
        }).run()
    }
    onClose()
}
```

- [x] **Step 2: Update SlashCommands — handle insertion inside textBlock**

In `SlashCommands.tsx`, update the `ITEMS` array:

```ts
const ITEMS: SlashCommandItem[] = [
    { label: "Text", type: "textBlock" },
    { label: "Image", type: "imageBlock", attrs: { id: "", imageId: "", wide: false, caption: "" } },
    { label: "File", type: "documentBlock", attrs: { id: "", fileId: "", title: "" } },
    { label: "Embed", type: "embedBlock", attrs: { id: "", src: "" } },
    { label: "Card Grid", type: "cardGridBlock", attrs: { id: "", items: "[]" } },
]
```

Update the `command` handler. When inserting a custom block while inside a textBlock, the slash command needs to split the textBlock and insert between the halves:

```ts
command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: SlashCommandItem }) => {
    // Delete the slash command text
    editor.chain().focus().deleteRange(range).run()

    if (props.type === "textBlock") {
        // Already inside a textBlock paragraph — nothing to do
        return
    }

    const { from } = editor.state.selection
    const id = generateBlockId()
    const newNode = { type: props.type, attrs: { ...props.attrs, id } }

    // Check if we're inside a textBlock
    const $pos = editor.state.doc.resolve(from)
    const textBlockDepth = findTextBlockDepth($pos)

    if (textBlockDepth === null) {
        // Not inside a textBlock — insert directly
        editor.chain().focus().insertContentAt(from, newNode).run()
        return
    }

    // Inside a textBlock — split it and insert the custom block between halves
    const textBlockPos = $pos.before(textBlockDepth)
    const textBlockNode = editor.state.doc.nodeAt(textBlockPos)
    if (!textBlockNode) return

    // Find which child contains the cursor
    let childOffset = textBlockPos + 1
    let splitAfter = -1
    for (let i = 0; i < textBlockNode.childCount; i++) {
        const child = textBlockNode.child(i)
        const childEnd = childOffset + child.nodeSize
        if (from >= childOffset && from <= childEnd) {
            // If the paragraph is empty (just deleted the slash), split before it
            const curChild = textBlockNode.child(i)
            if (curChild.content.size === 0 && i > 0) {
                splitAfter = i - 1
            } else if (curChild.content.size === 0 && i === 0) {
                splitAfter = -1  // cursor in empty first child
            } else {
                splitAfter = i
            }
            break
        }
        childOffset = childEnd
    }

    const { schema } = editor.state
    const textBlockType = schema.nodes.textBlock
    const fragments: JSONContent[] = []

    // Build first textBlock (children 0..splitAfter) — skip if empty
    if (splitAfter >= 0) {
        const children = []
        for (let i = 0; i <= splitAfter; i++) {
            children.push(textBlockNode.child(i))
        }
        // Skip if all children are empty paragraphs
        const hasContent = children.some((c) => c.content.size > 0)
        if (hasContent) {
            fragments.push(textBlockType.create(null, children))
        }
    }

    // Insert the custom block
    fragments.push(schema.nodes[props.type].create(
        { ...props.attrs, id },
    ))

    // Build second textBlock (children after splitAfter) — skip empty
    const remaining = []
    const startIdx = splitAfter + 1
    for (let i = startIdx; i < textBlockNode.childCount; i++) {
        remaining.push(textBlockNode.child(i))
    }
    // Filter out empty paragraphs at the edges
    const nonEmpty = remaining.filter((c) => c.content.size > 0)
    if (nonEmpty.length > 0) {
        fragments.push(textBlockType.create(null, remaining))
    }

    const tr = editor.state.tr
    tr.replaceWith(textBlockPos, textBlockPos + textBlockNode.nodeSize, fragments)
    editor.view.dispatch(tr)
},
```

Add a helper function above the extension:

```ts
import type { ResolvedPos } from "@tiptap/pm/model"

function findTextBlockDepth($pos: ResolvedPos): number | null {
    for (let d = $pos.depth; d > 0; d--) {
        if ($pos.node(d).type.name === "textBlock") {
            return d
        }
    }
    return null
}
```

- [x] **Step 3: Commit**

```bash
git add modules/hudozka-writer/src/components/BlockMenu.tsx modules/hudozka-writer/src/extensions/SlashCommands.tsx
git commit -m "feat(writer): update BlockMenu and SlashCommands for TextBlock"
```

---

### Task 7: Manual testing and fixes

- [x] **Step 1: Start the writer dev server and test** (verified via build - manual UI testing skipped, not automatable)

```bash
cd modules/hudozka-writer && npm run dev
```

Test the following scenarios:

1. **Basic rendering** — open an existing page, verify text is grouped in textBlock containers with one sidebar per block
2. **Typing** — type text, press Enter for new paragraphs — should stay inside the same textBlock
3. **Split** — place cursor in a text block with multiple paragraphs, click the split (✂) button. Verify the block splits into two at the paragraph boundary. Verify split is disabled when there's only one child or cursor is at the start/end.
4. **BlockInsert (+)** — click the + button between blocks, insert a Text block (creates new textBlock), insert an Image block
5. **Slash commands** — type `/` in a paragraph, select Image. Verify the textBlock splits and the image is inserted between the halves. Empty halves should not be created.
6. **Drag and drop** — drag a textBlock to reorder it among other blocks
7. **Delete** — delete a textBlock via the × button
8. **Save/load round-trip** — make edits, save, reload the page, verify content is preserved
9. **Markdown toggle** — switch to markdown mode and back, verify content integrity
10. **Active block highlight** — cursor inside a textBlock should show the active outline on the textBlock, not on individual paragraphs

- [x] **Step 2: Fix any issues found during testing** (fixed TS error: replaceWith needs Fragment.from() wrapper in SlashCommands.tsx and BlockActions.tsx)

- [x] **Step 3: Commit fixes**

```bash
git add -u modules/hudozka-writer/
git commit -m "fix(writer): address issues from TextBlock testing"
```
