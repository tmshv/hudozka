import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"

function DocumentBlockView({ node }: NodeViewProps) {
    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <div className="node-block-label">Document</div>
            <div className="node-block-info">
                <strong>{node.attrs.title || "Untitled"}</strong>
                <code>{node.attrs.fileId}</code>
            </div>
        </NodeViewWrapper>
    )
}

export const DocumentBlock = Node.create({
    name: "documentBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            fileId: { default: "" },
            title: { default: "" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-document-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-document-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(DocumentBlockView)
    },
})
