import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"

function CardGridBlockView({ node }: NodeViewProps) {
    const items = JSON.parse(node.attrs.items || "[]")
    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <div className="node-block-label">Card Grid</div>
            <div className="node-block-info">
                {items.length} item{items.length !== 1 ? "s" : ""}
            </div>
        </NodeViewWrapper>
    )
}

export const CardGridBlock = Node.create({
    name: "cardGridBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            items: { default: "[]" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-card-grid-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-card-grid-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(CardGridBlockView)
    },
})
