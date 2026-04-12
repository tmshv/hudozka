import { useEffect, useCallback } from "react"
import type { Editor } from "@tiptap/react"
import { Fragment } from "@tiptap/pm/model"
import "./BlockActions.css"

export type BlockActionsProps = {
    editor: Editor
    getPos: () => number | undefined
    showSplit?: boolean
}

export function BlockActions({ editor, getPos, showSplit }: BlockActionsProps) {
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

    const handleSplit = (e: React.MouseEvent) => {
        e.preventDefault()
        const pos = getPos()
        if (typeof pos !== "number") return
        const node = editor.state.doc.nodeAt(pos)
        if (!node || node.childCount < 2) return

        const { from } = editor.state.selection
        let childOffset = pos + 1
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

        if (splitAfter < 0 || splitAfter >= node.childCount - 1) return

        const firstChildren = []
        const secondChildren = []
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
        tr.replaceWith(pos, pos + node.nodeSize, Fragment.from([first, second]))
        editor.view.dispatch(tr)
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
}
