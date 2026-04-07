import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { BlockActions } from "../components/BlockActions"

function EmbedBlockView({ node, editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper className="node-readonly-block" data-drag-handle>
            <BlockActions editor={editor} getPos={getPos} />
            <div className="node-block-label">Embed</div>
            <div className="node-block-info">
                <code>{node.attrs.src}</code>
            </div>
        </NodeViewWrapper>
    )
}

export const EmbedBlock = Node.create({
    name: "embedBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            src: { default: "" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-embed-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-embed-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(EmbedBlockView)
    },
})
