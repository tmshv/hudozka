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
