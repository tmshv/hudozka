import Link from "@tiptap/extension-link"
import { MarkdownManager } from "@tiptap/markdown"
import StarterKit from "@tiptap/starter-kit"

let manager: MarkdownManager | null = null

export function getMarkdownManager(): MarkdownManager {
    if (!manager) {
        manager = new MarkdownManager({
            extensions: [StarterKit, Link],
        })
    }
    return manager
}
