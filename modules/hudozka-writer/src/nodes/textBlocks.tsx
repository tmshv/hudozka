import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import Paragraph from "@tiptap/extension-paragraph"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import Blockquote from "@tiptap/extension-blockquote"
import CodeBlock from "@tiptap/extension-code-block"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { BlockActions } from "../components/BlockActions"
import { BlockInsert } from "../components/BlockInsert"

function ParagraphView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"p"> className="node-view-content" as="p" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function HeadingView({ editor, getPos, node }: NodeViewProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tag = `h${node.attrs.level}` as any
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent className="node-view-content" as={tag} />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function BulletListView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"ul"> className="node-view-content" as="ul" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function OrderedListView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"ol"> className="node-view-content" as="ol" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function BlockquoteView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"blockquote"> className="node-view-content" as="blockquote" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function CodeBlockView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block" as="pre">
                <BlockActions editor={editor} getPos={getPos} />
                <NodeViewContent<"code"> className="node-view-content" as="code" />
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

function HorizontalRuleView({ editor, getPos }: NodeViewProps) {
    return (
        <>
            <NodeViewWrapper className="node-view-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
                    <hr />
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
    )
}

export const DraggableParagraph = Paragraph.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(ParagraphView)
    },
})

export const DraggableHeading = Heading.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(HeadingView)
    },
})

export const DraggableBulletList = BulletList.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(BulletListView)
    },
})

export const DraggableOrderedList = OrderedList.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(OrderedListView)
    },
})

export const DraggableBlockquote = Blockquote.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(BlockquoteView)
    },
})

export const DraggableCodeBlock = CodeBlock.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockView)
    },
})

export const DraggableHorizontalRule = HorizontalRule.extend({
    draggable: true,
    addNodeView() {
        return ReactNodeViewRenderer(HorizontalRuleView)
    },
})
