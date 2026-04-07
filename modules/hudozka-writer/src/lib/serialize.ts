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
import { getMarkdownManager } from "./markdown"

// -- DocV1 -> Tiptap JSON --

function textBlockToTiptap(block: DocV1BlockText): JSONContent[] {
    const manager = getMarkdownManager()
    const parsed = manager.parse(block.text)
    return parsed.content ?? []
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

const CUSTOM_BLOCK_TYPES = new Set([
    "imageBlock",
    "documentBlock",
    "embedBlock",
    "cardGridBlock",
])

function isCustomBlockNode(node: JSONContent): boolean {
    return CUSTOM_BLOCK_TYPES.has(node.type ?? "")
}

function textNodesToMarkdown(nodes: JSONContent[]): string {
    const manager = getMarkdownManager()
    const doc: JSONContent = { type: "doc", content: nodes }
    return manager.serialize(doc)
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
                id: generateBlockId(),
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
