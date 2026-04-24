# Writer Editor Improvements

Improvements to `modules/hudozka-writer/` — the Tiptap-based page editor for the hudozka CMS.

## 1. Fix Markdown Serialization + Global Toggle

### Problem

The `@tiptap/markdown` extension is registered but not used in the serialization layer (`src/lib/serialize.ts`). Currently:
- `docToTiptap()` splits text on `\n\n` and wraps each chunk in a plain paragraph node — no markdown parsing
- `tiptapToDoc()` extracts raw text content, discarding all inline marks (bold, italic, links) and block structure (headings, lists)

Result: formatting applied via toolbar is lost on save.

### Solution

Use `@tiptap/markdown` for both directions:

**Loading (DocV1 → Tiptap):** For each `text` block, call `editor.commands.setContent(block.text)` or use the Markdown extension's parser to convert the markdown string into Tiptap JSON nodes. This replaces the naive paragraph splitting in `textBlockToTiptap()`.

**Saving (Tiptap → DocV1):** When flushing the text buffer in `tiptapToDoc()`, use the Markdown extension's serializer (`editor.storage.markdown.getMarkdown()`) to convert Tiptap JSON back to a markdown string. This replaces the lossy `tiptapTextContent()` that strips all formatting.

Implementation approach: create a headless Tiptap editor instance (no DOM) used solely for markdown↔JSON conversion in `serialize.ts`. This keeps serialization pure and avoids coupling to the live editor instance.

### Global Markdown Toggle

Add a toolbar button that switches the entire editor between two modes:

- **Rendered mode** (default): Normal WYSIWYG editing via Tiptap
- **Markdown mode**: Replace the Tiptap editor surface with a plain `<textarea>` showing the serialized markdown of the full document

Toggle flow:
1. User clicks "MD" button in toolbar
2. Serialize current Tiptap content to markdown string (using the markdown serializer)
3. Hide `<EditorContent>`, show `<textarea>` with the markdown string
4. Custom blocks (image, document, embed, card-grid) are represented as fenced markers in the markdown view, e.g. `<!-- image:abc123 -->` — these are read-only anchors that preserve block positions
5. When toggling back: parse the textarea content, reconstruct Tiptap JSON, call `editor.commands.setContent()`

State: a single `markdownMode: boolean` in the `Editor` component.

## 2. Block Menu (Insert + Slash Commands)

### Hover "+" Button

A `+` button appears between blocks on hover. Clicking opens a dropdown menu with available block types:
- Text (inserts empty paragraph)
- Image (inserts imageBlock with empty attrs)
- File (inserts documentBlock with empty attrs)
- Embed (inserts embedBlock with empty attrs)
- Card Grid (inserts cardGridBlock with empty items)

Implementation: a Tiptap extension that uses a plugin to track cursor/hover position and renders a floating React element via a plugin view. The button appears in the left gutter between block-level nodes.

The dropdown is a simple list of block types. Clicking one inserts the corresponding node at the gap position using `editor.chain().focus().insertContentAt(pos, node).run()`.

### Slash Commands

Type `/` at the start of an empty paragraph to open the same block type picker as an inline dropdown. Uses Tiptap's `@tiptap/suggestion` pattern:

- Trigger: `/` character at start of empty paragraph
- Shows filtered list of block types (filters as user types, e.g. `/im` shows "Image")
- Enter or click to insert the selected block type, replacing the empty paragraph
- Escape to dismiss

Both the "+" menu and slash command share the same `BlockTypeMenu` React component — only the trigger and positioning differ.

### Block Types Available for Insertion

| Type      | Tiptap node     | Default attrs                              |
|-----------|-----------------|-------------------------------------------|
| Text      | paragraph       | empty paragraph                            |
| Image     | imageBlock      | `{ imageId: "", wide: false, caption: "" }`|
| File      | documentBlock   | `{ fileId: "", title: "" }`                |
| Embed     | embedBlock      | `{ src: "" }`                              |
| Card Grid | cardGridBlock   | `{ items: "[]" }`                          |

### Drag Reorder for All Blocks

All custom blocks already have `draggable: true`. No change needed for custom blocks.

For text blocks (paragraphs, headings, lists, etc.): Tiptap's default behavior allows cursor-based text editing, not dragging. Adding drag handles to standard text nodes would conflict with text selection. Leave text blocks non-draggable — users reorder text by cut/paste or by using the block menu to insert at the right position.

Custom blocks (image, document, embed, card-grid) remain draggable via their existing `data-drag-handle` attribute.

## 3. File Block Editor

Transform `DocumentBlock` from read-only display into a full editor, following the same pattern as `ImageBlock`.

### UI Layout

```
┌──────────────────────────────────────┐
│ Document                             │
│ ┌──────────────────────────────────┐ │
│ │ 📎 filename.pdf                  │ │
│ │    (or "Click to select file")   │ │
│ └──────────────────────────────────┘ │
│ Title: [___________________________] │
│                          [Pick] btn  │
└──────────────────────────────────────┘
```

### FilePicker Component

New component `src/components/FilePicker.tsx`, modeled after `ImagePicker`:

- **Browse tab**: paginated list of files from a PocketBase `files` collection (or whichever collection stores documents). Each row shows filename + file size. Click to select.
- **Upload tab**: file input (no `accept` restriction — any file type) + upload button. Creates a record in the files collection, returns the new record ID.

Props: `{ onSelect: (fileId: string) => void, onClose: () => void }`

### DocumentBlock Changes

- Add local state: `showPicker: boolean`, `filename: string | null` (resolved from PB)
- On mount (when `fileId` is set): fetch file record from PB to get `filename` for display
- "Pick" button opens `FilePicker` modal
- Title field: inline `<input>` that calls `updateAttributes({ title: value })`
- Selecting a new file via picker calls `updateAttributes({ fileId: newId })`

### PocketBase Collection

Assumes a `files` collection exists with at least: `id`, `file` (file field), `filename` (string). If not, this needs to be created in PocketBase schema. The exact collection name and schema should be verified before implementation.

## 4. Card Grid Display Enhancement

`CardGridBlock` stays read-only. Enhance the view to show resolved page titles instead of just item count.

### Current Display
```
Card Grid
3 items
```

### New Display
```
Card Grid (3)
• Акварельная живопись
• Графический дизайн
• Скульптура и керамика
```

### Implementation

In `CardGridBlockView`:
1. Parse `items` from attrs (already done)
2. For each item, fetch `pb.collection("pages").getOne(item.page)` to get the page title
3. Show a bulleted list of page titles
4. Handle loading state (show "Loading..." while fetching)
5. Handle missing pages (show page ID if fetch fails)

Use `useEffect` + `useState` to batch-fetch all page titles on mount or when `items` attr changes. Cache results to avoid redundant fetches during re-renders.

## Files to Create

| File                                  | Purpose                            |
|---------------------------------------|------------------------------------|
| `src/components/FilePicker.tsx`       | File browse/upload modal           |
| `src/components/FilePicker.css`       | FilePicker styles                  |
| `src/components/BlockMenu.tsx`        | Shared block type dropdown         |
| `src/components/BlockMenu.css`        | BlockMenu styles                   |
| `src/nodes/BlockInsertButton.tsx`     | Hover "+" Tiptap plugin view       |
| `src/extensions/SlashCommands.ts`     | Slash command Tiptap extension     |

## Files to Modify

| File                                  | Changes                                          |
|---------------------------------------|--------------------------------------------------|
| `src/lib/serialize.ts`               | Use `@tiptap/markdown` for text block conversion  |
| `src/components/Editor.tsx`          | Add markdown toggle state, register new extensions |
| `src/components/Toolbar.tsx`         | Add "MD" toggle button                            |
| `src/nodes/DocumentBlock.tsx`        | Add interactive editing (picker, title input)      |
| `src/nodes/CardGridBlock.tsx`        | Fetch and display page titles                      |
| `src/nodes/index.ts`                 | Export new extensions                              |
| `src/components/Editor.css`          | Styles for markdown textarea mode                  |

## Out of Scope

- Undo/redo system (deferred)
- Per-block markdown toggle (future enhancement)
- Card grid editing (add/remove/reorder items)
- Embed block editing
