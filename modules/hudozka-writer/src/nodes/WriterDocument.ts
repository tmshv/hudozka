import { Node } from "@tiptap/core"

export const WriterDocument = Node.create({
    name: "doc",
    topNode: true,
    content: "(textBlock | imageBlock | documentBlock | embedBlock | cardGridBlock)+",
})
