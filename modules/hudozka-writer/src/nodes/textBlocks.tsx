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

function ParagraphView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent<"p"> as="p" />
        </NodeViewWrapper>
    )
}

function HeadingView({ editor, getPos, node }: NodeViewProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tag = `h${node.attrs.level}` as any
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent as={tag} />
        </NodeViewWrapper>
    )
}

function BulletListView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent<"ul"> as="ul" />
        </NodeViewWrapper>
    )
}

function OrderedListView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent<"ol"> as="ol" />
        </NodeViewWrapper>
    )
}

function BlockquoteView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent<"blockquote"> as="blockquote" />
        </NodeViewWrapper>
    )
}

function CodeBlockView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper as="pre">
            <BlockActions editor={editor} getPos={getPos} />
            <NodeViewContent<"code"> as="code" />
        </NodeViewWrapper>
    )
}

function HorizontalRuleView({ editor, getPos }: NodeViewProps) {
    return (
        <NodeViewWrapper>
            <BlockActions editor={editor} getPos={getPos} />
            <hr />
        </NodeViewWrapper>
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
