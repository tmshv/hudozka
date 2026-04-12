# TextBlock Container Redesign

## Problem

The writer editor has a flat document schema where every paragraph, heading, list, etc. is a top-level block with its own sidebar actions (delete, drag) and insert button. This causes two issues:

1. List items inside bullet/ordered lists each get their own sidebar actions (because paragraphs inside list items use custom DraggableXxx node views)
2. Conceptually related text content (several paragraphs in sequence) appears as many independent blocks instead of one cohesive unit

## Solution

Introduce a `textBlock` container node that groups text-level content. Each `textBlock` gets one set of sidebar actions. Media blocks (image, document, embed, card-grid) remain standalone top-level blocks as they are today.

## Document Schema

Current:
```
doc → (paragraph | heading | bulletList | ... | imageBlock | documentBlock | ...)+
```

New:
```
doc → (textBlock | imageBlock | documentBlock | embedBlock | cardGridBlock)+
textBlock → (paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule)+
```

## TextBlock Node

- Tiptap `Node.create()` with `name: "textBlock"`, `group: "block"`, `draggable: true`
- Content spec allows standard text-level nodes inside it
- Node view renders the same pattern as other blocks:
  - `BlockActions` (delete, split, drag handle) inside `NodeViewWrapper`
  - `NodeViewContent` for the editable area
  - `BlockInsert` after the wrapper

## BlockActions Changes

`BlockActions` gets a new `showSplit` prop, only passed by `textBlock`. The sidebar shows three buttons for text blocks:

1. Delete (×)
2. Split (✂) — splits the text block at cursor position
3. Drag handle (⠇)

Custom blocks (image, document, etc.) keep delete + drag only.

## Split Operation

When the user clicks Split:

1. Find cursor position within the `textBlock`
2. Determine which child node the cursor is in
3. Split at the boundary between child nodes — the block divides into two `textBlock` nodes
4. If either half would be empty, don't create it
5. Split is disabled when: cursor at the very start/end, or the text block contains only one child node

Split happens at child-node boundaries, not mid-paragraph.

## Serialization

The `DocV1` format does not change. The serialization/deserialization logic in `serialize.ts` is updated to work with `textBlock` container nodes instead of the current buffer-accumulation pattern.

## What Gets Removed

- All `DraggableXxx` wrappers: `DraggableParagraph`, `DraggableHeading`, `DraggableBulletList`, `DraggableOrderedList`, `DraggableBlockquote`, `DraggableCodeBlock`, `DraggableHorizontalRule`
- Standard StarterKit extensions used instead (no longer disabled in `StarterKit.configure()`)
- Text-level nodes lose their individual `BlockActions` and `BlockInsert`
- The `textBlocks.tsx` file is replaced with the new `TextBlock` node definition
