import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import { createRoot } from "react-dom/client"
import { BlockMenu } from "../components/BlockMenu"
import type { Editor } from "@tiptap/react"
import "./BlockInsert.css"

const blockInsertPluginKey = new PluginKey("blockInsert")

function createInsertButton(view: EditorView, tiptapEditor: Editor) {
    const button = document.createElement("button")
    button.className = "block-insert-btn"
    button.textContent = "+"
    button.style.display = "none"

    const menuContainer = document.createElement("div")
    menuContainer.className = "block-insert-menu-container"
    menuContainer.style.display = "none"
    const menuRoot = createRoot(menuContainer)

    let currentPos = 0
    let menuOpen = false

    function showMenu() {
        menuOpen = true
        menuContainer.style.display = "block"
        menuRoot.render(
            <BlockMenu
                editor={tiptapEditor}
                position={currentPos}
                onClose={hideMenu}
            />
        )
    }

    function hideMenu() {
        menuOpen = false
        menuContainer.style.display = "none"
    }

    button.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (menuOpen) {
            hideMenu()
        } else {
            showMenu()
        }
    })

    // Close menu on click outside
    document.addEventListener("click", (e) => {
        if (menuOpen && !menuContainer.contains(e.target as Node) && e.target !== button) {
            hideMenu()
        }
    })

    const wrapper = document.createElement("div")
    wrapper.className = "block-insert-wrapper"
    wrapper.appendChild(button)
    wrapper.appendChild(menuContainer)

    view.dom.parentElement?.appendChild(wrapper)

    function handleMouseMove(e: MouseEvent) {
        if (menuOpen) return

        const editorRect = view.dom.getBoundingClientRect()
        const y = e.clientY

        // Find the position between blocks
        const pos = view.posAtCoords({ left: editorRect.left + 1, top: y })
        if (!pos) {
            button.style.display = "none"
            return
        }

        const resolvedPos = view.state.doc.resolve(pos.pos)
        // Only show between top-level blocks
        if (resolvedPos.depth > 1) {
            button.style.display = "none"
            return
        }

        // Get the block node at this position
        const blockPos = resolvedPos.before(1)
        const domNode = view.nodeDOM(blockPos)
        if (!domNode || !(domNode instanceof HTMLElement)) {
            button.style.display = "none"
            return
        }

        const nodeRect = domNode.getBoundingClientRect()
        const isNearBottom = y > nodeRect.bottom - 8

        if (isNearBottom) {
            // Position after this block
            currentPos = blockPos + resolvedPos.parent.nodeSize
            const top = nodeRect.bottom - editorRect.top
            wrapper.style.top = `${top}px`
            button.style.display = "block"
        } else if (y < nodeRect.top + 8) {
            // Position before this block
            currentPos = blockPos
            const top = nodeRect.top - editorRect.top
            wrapper.style.top = `${top}px`
            button.style.display = "block"
        } else {
            button.style.display = "none"
        }
    }

    function handleMouseLeave() {
        if (!menuOpen) {
            button.style.display = "none"
        }
    }

    view.dom.addEventListener("mousemove", handleMouseMove)
    view.dom.addEventListener("mouseleave", handleMouseLeave)

    return {
        destroy() {
            view.dom.removeEventListener("mousemove", handleMouseMove)
            view.dom.removeEventListener("mouseleave", handleMouseLeave)
            menuRoot.unmount()
            wrapper.remove()
        },
    }
}

export const BlockInsert = Extension.create({
    name: "blockInsert",

    addProseMirrorPlugins() {
        const editor = this.editor as Editor
        return [
            new Plugin({
                key: blockInsertPluginKey,
                view(editorView) {
                    const instance = createInsertButton(editorView, editor)
                    return {
                        destroy() {
                            instance.destroy()
                        },
                    }
                },
            }),
        ]
    },
})
