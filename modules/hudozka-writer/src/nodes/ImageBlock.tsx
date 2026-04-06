import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { pb } from "../pb"
import type { PbImage } from "../types"
import { useState, useEffect } from "react"

function ImageBlockView({ node, updateAttributes }: NodeViewProps) {
    const { imageId, wide, caption } = node.attrs
    const [thumbnail, setThumbnail] = useState<string | null>(null)

    useEffect(() => {
        if (!imageId) return
        pb.collection("images").getOne<PbImage>(imageId).then((img) => {
            const url = pb.files.getURL(img, img.file, { thumb: "300x200" })
            setThumbnail(url)
        }).catch(() => {
            setThumbnail(null)
        })
    }, [imageId])

    return (
        <NodeViewWrapper className="node-image-block" data-drag-handle>
            <div className="node-block-label">Image</div>
            {thumbnail ? (
                <img src={thumbnail} alt={caption || "image"} className="node-image-thumb" />
            ) : (
                <div className="node-image-placeholder">
                    {imageId ? "Loading..." : "No image selected"}
                </div>
            )}
            <div className="node-image-controls">
                <label>
                    <input
                        type="checkbox"
                        checked={wide}
                        onChange={(e) => updateAttributes({ wide: e.target.checked })}
                    />
                    Wide
                </label>
                <input
                    type="text"
                    placeholder="Caption"
                    value={caption || ""}
                    onChange={(e) => updateAttributes({ caption: e.target.value })}
                    className="node-image-caption"
                />
            </div>
        </NodeViewWrapper>
    )
}

export const ImageBlock = Node.create({
    name: "imageBlock",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            id: { default: null },
            imageId: { default: "" },
            wide: { default: false },
            caption: { default: "" },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-image-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["div", mergeAttributes(HTMLAttributes, { "data-image-block": "" })]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageBlockView)
    },
})
