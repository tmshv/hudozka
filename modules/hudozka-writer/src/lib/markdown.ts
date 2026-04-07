import { MarkdownManager } from "@tiptap/markdown"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"

let manager: MarkdownManager | null = null

export function getMarkdownManager(): MarkdownManager {
    if (!manager) {
        manager = new MarkdownManager({
            extensions: [
                StarterKit,
                Link,
            ],
        })
    }
    return manager
}
