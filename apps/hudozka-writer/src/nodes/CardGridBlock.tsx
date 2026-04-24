import { mergeAttributes, Node } from "@tiptap/core"
import type { NodeViewProps } from "@tiptap/react"
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"
import { useEffect, useState } from "react"
import { BlockActions } from "../components/BlockActions"
import { BlockInsert } from "../components/BlockInsert"
import { pb } from "../pb"
import type { PbPage } from "../types"

type ResolvedItem = {
    page: string
    title: string | null
}

function CardGridBlockView({ node, editor, getPos }: NodeViewProps) {
    const items = JSON.parse(node.attrs.items || "[]")
    const [resolved, setResolved] = useState<ResolvedItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (items.length === 0) {
            setResolved([])
            return
        }

        setLoading(true)
        Promise.all(
            items.map(async (item: { page: string }) => {
                try {
                    const page = await pb.collection("pages").getOne<PbPage>(item.page)
                    return { page: item.page, title: page.title }
                } catch {
                    return { page: item.page, title: null }
                }
            }),
        ).then(results => {
            setResolved(results)
            setLoading(false)
        })
    }, [node.attrs.items])

    return (
        <>
            <NodeViewWrapper className="node-view-block node-readonly-block">
                <BlockActions editor={editor} getPos={getPos} />
                <div className="node-view-content">
                    <div className="node-block-label">Card Grid ({items.length})</div>
                    {loading ? (
                        <div className="node-block-info">Loading...</div>
                    ) : (
                        <ul className="node-cardgrid-list">
                            {resolved.map(item => (
                                <li key={item.page} className="node-cardgrid-item">
                                    {item.title ?? item.page}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </NodeViewWrapper>
            <BlockInsert editor={editor} getPos={getPos} />
        </>
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
