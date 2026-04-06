import { Node, mergeAttributes } from "@tiptap/core"

export const TextBlock = Node.create({
    name: "textBlock",
    group: "block",
    content: "block+",

    addAttributes() {
        return {
            id: { default: null },
        }
    },

    parseHTML() {
        return [{ tag: "div[data-text-block]" }]
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, { "data-text-block": "" }),
            0,
        ]
    },
})
