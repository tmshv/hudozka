import { mergeAttributes, Node } from "@tiptap/core"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { BlockActions } from "../components/BlockActions"
import { BlockInsert } from "../components/BlockInsert"

function EmbedBlockView({ node, editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block node-readonly-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
                    <div className="node-block-label">Embed</div>
                    <div className="node-block-info">
                        <code>{node.attrs.src}</code>
                    </div>
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
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
