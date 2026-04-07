import { Extension } from "@tiptap/core"
import { Plugin, PluginKey, NodeSelection } from "@tiptap/pm/state"
import type { EditorView } from "@tiptap/pm/view"
import { createRoot } from "react-dom/client"
import { BlockMenu } from "../components/BlockMenu"
import type { Editor } from "@tiptap/react"
import "./BlockInsert.css"

const blockInsertPluginKey = new PluginKey("blockInsert")

function getActiveBlockInfo(view: EditorView) {
    const { from } = view.state.selection
    const resolved = view.state.doc.resolve(from)
    if (resolved.depth < 1) return null

    const blockPos = resolved.before(1)
    const node = view.state.doc.nodeAt(blockPos)
    if (!node) return null

    const domNode = view.nodeDOM(blockPos)
    if (!domNode || !(domNode instanceof HTMLElement)) return null

    return { blockPos, node, domNode, endPos: blockPos + node.nodeSize }
}

function createBlockActions(view: EditorView, tiptapEditor: Editor) {
    const wrapper = document.createElement("div")
    wrapper.className = "block-insert-wrapper"

    const dragBtn = document.createElement("div")
    dragBtn.className = "block-insert-btn block-drag-btn"
    dragBtn.textContent = "\u2807"
    dragBtn.title = "Drag to reorder"
    dragBtn.setAttribute("draggable", "true")

    const addBtn = document.createElement("button")
    addBtn.className = "block-insert-btn"
    addBtn.textContent = "+"
    addBtn.title = "Add block"

    const deleteBtn = document.createElement("button")
    deleteBtn.className = "block-insert-btn block-delete-btn"
    deleteBtn.textContent = "\u00d7"
    deleteBtn.title = "Delete block"

    const menuContainer = document.createElement("div")
    menuContainer.className = "block-insert-menu-container"
    menuContainer.style.display = "none"
    const menuRoot = createRoot(menuContainer)

    let insertPos = 0
    let menuOpen = false

    function showMenu() {
        menuOpen = true
        menuContainer.style.display = "block"
        menuRoot.render(
            <BlockMenu
                editor={tiptapEditor}
                position={insertPos}
                onClose={hideMenu}
            />
        )
    }

    function hideMenu() {
        menuOpen = false
        menuContainer.style.display = "none"
    }

    addBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (menuOpen) {
            hideMenu()
        } else {
            showMenu()
        }
    })

    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        hideMenu()
        const info = getActiveBlockInfo(view)
        if (info) {
            tiptapEditor.chain().focus().deleteRange({
                from: info.blockPos,
                to: info.endPos,
            }).run()
        }
    })

    // Drag handle: on native dragstart, set up ProseMirror drag state.
    // The button is outside view.dom, so PM's own dragstart handler won't fire.
    // We replicate what PM does internally: serialize the node, set dataTransfer,
    // and assign view.dragging with the node selection so handleDrop can move it.
    let isDragging = false

    dragBtn.addEventListener("dragstart", (e) => {
        const info = getActiveBlockInfo(view)
        if (!info || !e.dataTransfer) {
            e.preventDefault()
            return
        }

        isDragging = true

        // Build a NodeSelection without dispatching (avoids PM state churn)
        const nodeSelection = NodeSelection.create(view.state.doc, info.blockPos)
        const draggedSlice = nodeSelection.content()

        // Use PM's own serializer to match what its internal dragstart does
        const { dom, text, slice } = view.serializeForClipboard(draggedSlice)
        e.dataTransfer.clearData()
        e.dataTransfer.setData("text/html", dom.innerHTML)
        e.dataTransfer.setData("text/plain", text)
        e.dataTransfer.effectAllowed = "copyMove"

        // Set the drag ghost to the block element
        e.dataTransfer.setDragImage(info.domNode, 0, 0)

        // PM's handleDrop reads dragging.node to delete the source on move.
        // Dragging class isn't exported, but handleDrop just reads .slice/.move/.node.
        view.dragging = { slice, move: true, node: nodeSelection } as typeof view.dragging
    })

    dragBtn.addEventListener("dragend", () => {
        isDragging = false
        view.dragging = null
    })

    // Close menu on click outside
    document.addEventListener("click", (e) => {
        if (menuOpen && !menuContainer.contains(e.target as Node) && e.target !== addBtn) {
            hideMenu()
        }
    })

    wrapper.appendChild(dragBtn)
    wrapper.appendChild(addBtn)
    wrapper.appendChild(deleteBtn)
    wrapper.appendChild(menuContainer)

    view.dom.parentElement?.appendChild(wrapper)

    function updatePosition() {
        const info = getActiveBlockInfo(view)
        if (!info) {
            if (!menuOpen) {
                wrapper.classList.remove("visible")
            }
            return
        }

        const editorRect = view.dom.getBoundingClientRect()
        const nodeRect = info.domNode.getBoundingClientRect()
        const top = nodeRect.top - editorRect.top
        wrapper.style.top = `${top}px`
        wrapper.classList.add("visible")
        insertPos = info.endPos
    }

    // Update on selection/doc changes via plugin update callback
    function update() {
        if (menuOpen || isDragging) return
        updatePosition()
    }

    return {
        wrapper,
        update,
        destroy() {
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
                    const instance = createBlockActions(editorView, editor)
                    return {
                        update() {
                            instance.update()
                        },
                        destroy() {
                            instance.destroy()
                        },
                    }
                },
            }),
        ]
    },
})
