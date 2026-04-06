import type { JSONContent } from "@tiptap/core"
import type {
    DocV1,
    DocV1Block,
    DocV1BlockText,
    DocV1BlockImage,
    DocV1BlockDocument,
    DocV1BlockEmbed,
    DocV1BlockCardGrid,
} from "../types"
import { generateBlockId } from "./id"

// -- DocV1 -> Tiptap JSON --

function textBlockToTiptap(block: DocV1BlockText): JSONContent[] {
    // Return a wrapper node that holds the markdown text for the Markdown extension to parse
    // We use a custom "textBlock" node to preserve the block ID and enable round-tripping
    return [{
        type: "textBlock",
        attrs: { id: block.id },
        content: [{
            type: "paragraph",
            content: [{ type: "text", text: block.text }],
        }],
    }]
}

function imageBlockToTiptap(block: DocV1BlockImage): JSONContent {
    return {
        type: "imageBlock",
        attrs: {
            id: block.id,
            imageId: block.image,
            wide: block.wide,
            caption: block.caption,
        },
    }
}

function documentBlockToTiptap(block: DocV1BlockDocument): JSONContent {
    return {
        type: "documentBlock",
        attrs: {
            id: block.id,
            fileId: block.file,
            title: block.title,
        },
    }
}

function embedBlockToTiptap(block: DocV1BlockEmbed): JSONContent {
    return {
        type: "embedBlock",
        attrs: {
            id: block.id,
            src: block.src,
        },
    }
}

function cardGridBlockToTiptap(block: DocV1BlockCardGrid): JSONContent {
    return {
        type: "cardGridBlock",
        attrs: {
            id: block.id,
            items: JSON.stringify(block.items),
        },
    }
}

export function docToTiptap(doc: DocV1): JSONContent {
    const content: JSONContent[] = []

    for (const block of doc.blocks) {
        switch (block.type) {
        case "text":
            content.push(...textBlockToTiptap(block))
            break
        case "image":
            content.push(imageBlockToTiptap(block))
            break
        case "document":
            content.push(documentBlockToTiptap(block))
            break
        case "embed":
            content.push(embedBlockToTiptap(block))
            break
        case "card-grid":
            content.push(cardGridBlockToTiptap(block))
            break
        }
    }

    return {
        type: "doc",
        content,
    }
}

// -- Tiptap JSON -> DocV1 --

function isCustomBlockNode(node: JSONContent): boolean {
    return ["imageBlock", "documentBlock", "embedBlock", "cardGridBlock"].includes(node.type ?? "")
}

function tiptapTextContent(node: JSONContent): string {
    // Recursively extract text from Tiptap JSON node
    if (node.type === "text") return node.text ?? ""
    if (!node.content) return ""
    return node.content.map(tiptapTextContent).join("")
}

function textNodesToMarkdown(nodes: JSONContent[]): string {
    // For textBlock nodes, extract the raw markdown text
    // For other rich-text nodes, we need to convert back
    // The Markdown extension handles this via editor.storage.markdown.getMarkdown()
    // This is a fallback for direct JSON conversion
    const parts: string[] = []
    for (const node of nodes) {
        if (node.type === "textBlock") {
            // Extract text content from the textBlock wrapper
            parts.push(tiptapTextContent(node))
        } else {
            parts.push(tiptapTextContent(node))
        }
    }
    return parts.join("\n\n")
}

export function tiptapToDoc(content: JSONContent[]): DocV1 {
    const blocks: DocV1Block[] = []
    let textBuffer: JSONContent[] = []

    function flushTextBuffer() {
        if (textBuffer.length === 0) return
        const text = textNodesToMarkdown(textBuffer)
        if (text.trim()) {
            blocks.push({
                type: "text",
                id: textBuffer[0].attrs?.id ?? generateBlockId(),
                text,
            })
        }
        textBuffer = []
    }

    for (const node of content) {
        if (isCustomBlockNode(node)) {
            flushTextBuffer()
            const attrs = node.attrs ?? {}

            switch (node.type) {
            case "imageBlock":
                blocks.push({
                    type: "image",
                    id: attrs.id ?? generateBlockId(),
                    image: attrs.imageId ?? "",
                    wide: attrs.wide ?? false,
                    caption: attrs.caption ?? "",
                })
                break

            case "documentBlock":
                blocks.push({
                    type: "document",
                    id: attrs.id ?? generateBlockId(),
                    file: attrs.fileId ?? "",
                    title: attrs.title ?? "",
                })
                break

            case "embedBlock":
                blocks.push({
                    type: "embed",
                    id: attrs.id ?? generateBlockId(),
                    src: attrs.src ?? "",
                })
                break

            case "cardGridBlock":
                blocks.push({
                    type: "card-grid",
                    id: attrs.id ?? generateBlockId(),
                    items: JSON.parse(attrs.items ?? "[]"),
                })
                break
            }
        } else {
            textBuffer.push(node)
        }
    }

    flushTextBuffer()

    return { version: 1, blocks }
}
