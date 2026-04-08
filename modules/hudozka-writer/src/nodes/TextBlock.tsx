import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { BlockActions } from "../components/BlockActions"
import { BlockInsert } from "../components/BlockInsert"

function TextBlockView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block node-text-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent className="node-view-content" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

export const TextBlock = Node.create({
    name: "textBlock",
    group: "block",
    content: "(paragraph | heading | bulletList | orderedList | blockquote | codeBlock | horizontalRule)+",
    draggable: true,
    defining: true,

    parseHTML() {
        return [{ tag: "div[data-text-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-text-block": "" }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(TextBlockView)
    },
})
