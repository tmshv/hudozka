import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { useState, useEffect } from "react"
import { pb } from "../pb"
import { FilePicker } from "../components/FilePicker"
import type { PbFile } from "../types"
import { BlockActions } from "../components/BlockActions"

function DocumentBlockView({ node, updateAttributes, editor, getPos }: NodeViewProps) {
    const { fileId, title } = node.attrs
    const [filename, setFilename] = useState<string | null>(null)
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (!fileId) return
        pb.collection("files").getOne<PbFile>(fileId).then((f) => {
            setFilename(f.filename)
        }).catch(() => {
            setFilename(null)
        })
    }, [fileId])

    function handleSelect(newFileId: string) {
        updateAttributes({ fileId: newFileId })
        setShowPicker(false)
    }

    return (
        <NodeViewWrapper className="node-document-block" data-drag-handle>
            <BlockActions editor={editor} getPos={getPos} />
            <div className="node-block-label">File</div>
            {fileId ? (
                <div
                    className="node-document-file"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                >
                    📎 {filename ?? fileId}
                </div>
            ) : (
                <div
                    className="node-document-placeholder"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                >
                    Click to select file
                </div>
            )}
            <div className="node-document-controls">
                <input
                    type="text"
                    placeholder="Title"
                    value={title || ""}
                    onChange={(e) => updateAttributes({ title: e.target.value })}
                    className="node-document-title"
                />
                <button
                    className="node-image-pick-btn"
                    onClick={() => setShowPicker(true)}
                >
                    Pick
                </button>
            </div>
            {showPicker && (
                <FilePicker
                    onSelect={handleSelect}
                    onClose={() => setShowPicker(false)}
                />
            )}
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
