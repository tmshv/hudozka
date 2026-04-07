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
