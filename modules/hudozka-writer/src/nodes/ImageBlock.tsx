import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react"
import type { NodeViewProps } from "@tiptap/react"
import { pb } from "../pb"
import type { PbImage } from "../types"
import { useState, useEffect } from "react"
import { ImagePicker } from "../components/ImagePicker"
import { BlockActions } from "../components/BlockActions"

function ImageBlockView({ node, updateAttributes, editor, getPos }: NodeViewProps) {
    const { imageId, wide, caption } = node.attrs
    const [thumbnail, setThumbnail] = useState<string | null>(null)
    const [showPicker, setShowPicker] = useState(false)

    useEffect(() => {
        if (!imageId) return
        pb.collection("images").getOne<PbImage>(imageId).then((img) => {
            const url = pb.files.getURL(img, img.file, { thumb: "300x200" })
            setThumbnail(url)
        }).catch(() => {
            setThumbnail(null)
        })
    }, [imageId])

    function handleSelect(newImageId: string) {
        updateAttributes({ imageId: newImageId })
        setShowPicker(false)
    }

    return (
        <NodeViewWrapper className="node-image-block">
            <BlockActions editor={editor} getPos={getPos} />
            <div className="node-block-label">Image</div>
            {thumbnail ? (
                <img
                    src={thumbnail}
                    alt={caption || "image"}
                    className="node-image-thumb"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                />
            ) : (
                <div
                    className="node-image-placeholder"
                    onClick={() => setShowPicker(true)}
                    style={{ cursor: "pointer" }}
                >
                    {imageId ? "Loading..." : "Click to select image"}
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
                <button
                    className="node-image-pick-btn"
                    onClick={() => setShowPicker(true)}
                >
                    Pick
                </button>
            </div>
            {showPicker && (
                <ImagePicker
                    onSelect={handleSelect}
                    onClose={() => setShowPicker(false)}
                />
            )}
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
