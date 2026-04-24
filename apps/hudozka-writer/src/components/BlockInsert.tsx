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
