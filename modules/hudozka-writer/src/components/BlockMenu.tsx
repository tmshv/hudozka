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
