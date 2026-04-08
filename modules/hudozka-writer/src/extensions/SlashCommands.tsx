import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
import type { ResolvedPos } from "@tiptap/pm/model"
import Suggestion from "@tiptap/suggestion"
import type { SuggestionOptions, SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion"
import { createRoot } from "react-dom/client"
import { generateBlockId } from "../lib/id"
import type { Editor } from "@tiptap/react"
import "./SlashCommands.css"

type SlashCommandItem = {
    label: string
    type: string
    attrs?: Record<string, unknown>
}

const ITEMS: SlashCommandItem[] = [
    { label: "Text", type: "textBlock" },
    { label: "Image", type: "imageBlock", attrs: { id: "", imageId: "", wide: false, caption: "" } },
    { label: "File", type: "documentBlock", attrs: { id: "", fileId: "", title: "" } },
    { label: "Embed", type: "embedBlock", attrs: { id: "", src: "" } },
    { label: "Card Grid", type: "cardGridBlock", attrs: { id: "", items: "[]" } },
]

const slashCommandsPluginKey = new PluginKey("slashCommands")

function findTextBlockDepth($pos: ResolvedPos): number | null {
    for (let d = $pos.depth; d > 0; d--) {
        if ($pos.node(d).type.name === "textBlock") {
            return d
        }
    }
    return null
}

function SlashMenu({ items, command, selectedIndex }: { items: SlashCommandItem[]; command: (item: SlashCommandItem) => void; selectedIndex: number }) {
    if (items.length === 0) return null

    return (
        <div className="slash-menu">
            {items.map((item, index) => (
                <button
                    key={item.type}
                    className={`slash-menu-item${index === selectedIndex ? " slash-menu-item--selected" : ""}`}
                    onClick={() => command(item)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}

export const SlashCommands = Extension.create({
    name: "slashCommands",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                pluginKey: slashCommandsPluginKey,
                startOfLine: true,
                items: ({ query }: { query: string }) => {
                    return ITEMS.filter((item) =>
                        item.label.toLowerCase().includes(query.toLowerCase())
                    )
                },
                render: () => {
                    let container: HTMLDivElement | null = null
                    let root: ReturnType<typeof createRoot> | null = null
                    let selectedIndex = 0
                    let currentItems: SlashCommandItem[] = []
                    let currentCommand: ((item: SlashCommandItem) => void) | null = null

                    function renderMenu() {
                        if (!root) return
                        root.render(
                            <SlashMenu
                                items={currentItems}
                                command={currentCommand!}
                                selectedIndex={selectedIndex}
                            />
                        )
                    }

                    return {
                        onStart: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => {
                            container = document.createElement("div")
                            container.className = "slash-command-container"
                            document.body.appendChild(container)
                            root = createRoot(container)

                            const rect = props.clientRect?.()
                            if (rect && container) {
                                container.style.position = "fixed"
                                container.style.left = `${rect.left}px`
                                container.style.top = `${rect.bottom + 4}px`
                                container.style.zIndex = "50"
                            }

                            selectedIndex = 0
                            currentItems = props.items
                            currentCommand = props.command
                            renderMenu()
                        },
                        onUpdate: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => {
                            if (!root || !container) return

                            const rect = props.clientRect?.()
                            if (rect && container) {
                                container.style.left = `${rect.left}px`
                                container.style.top = `${rect.bottom + 4}px`
                            }

                            currentItems = props.items
                            currentCommand = props.command
                            selectedIndex = 0
                            renderMenu()
                        },
                        onExit: () => {
                            root?.unmount()
                            container?.remove()
                            container = null
                            root = null
                        },
                        onKeyDown: (props: SuggestionKeyDownProps) => {
                            const { key } = props.event
                            if (key === "Escape") {
                                root?.unmount()
                                container?.remove()
                                container = null
                                root = null
                                return true
                            }
                            if (key === "ArrowDown") {
                                selectedIndex = (selectedIndex + 1) % currentItems.length
                                renderMenu()
                                return true
                            }
                            if (key === "ArrowUp") {
                                selectedIndex = (selectedIndex - 1 + currentItems.length) % currentItems.length
                                renderMenu()
                                return true
                            }
                            if (key === "Enter") {
                                if (currentItems[selectedIndex] && currentCommand) {
                                    currentCommand(currentItems[selectedIndex])
                                }
                                return true
                            }
                            return false
                        },
                    }
                },
                command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: SlashCommandItem }) => {
                    // Delete the slash command text
                    editor.chain().focus().deleteRange(range).run()

                    if (props.type === "textBlock") {
                        // Already inside a textBlock paragraph — nothing to do
                        return
                    }

                    const { from } = editor.state.selection
                    const id = generateBlockId()
                    const newNode = { type: props.type, attrs: { ...props.attrs, id } }

                    // Check if we're inside a textBlock
                    const $pos = editor.state.doc.resolve(from)
                    const textBlockDepth = findTextBlockDepth($pos)

                    if (textBlockDepth === null) {
                        // Not inside a textBlock — insert directly
                        editor.chain().focus().insertContentAt(from, newNode).run()
                        return
                    }

                    // Inside a textBlock — split it and insert the custom block between halves
                    const textBlockPos = $pos.before(textBlockDepth)
                    const textBlockNode = editor.state.doc.nodeAt(textBlockPos)
                    if (!textBlockNode) return

                    // Find which child contains the cursor
                    let childOffset = textBlockPos + 1
                    let splitAfter = -1
                    for (let i = 0; i < textBlockNode.childCount; i++) {
                        const child = textBlockNode.child(i)
                        const childEnd = childOffset + child.nodeSize
                        if (from >= childOffset && from <= childEnd) {
                            // If the paragraph is empty (just deleted the slash), split before it
                            const curChild = textBlockNode.child(i)
                            if (curChild.content.size === 0 && i > 0) {
                                splitAfter = i - 1
                            } else if (curChild.content.size === 0 && i === 0) {
                                splitAfter = -1  // cursor in empty first child
                            } else {
                                splitAfter = i
                            }
                            break
                        }
                        childOffset = childEnd
                    }

                    const { schema } = editor.state
                    const textBlockType = schema.nodes.textBlock
                    const fragments: Parameters<typeof editor.state.tr.replaceWith>[2][] = []

                    // Build first textBlock (children 0..splitAfter) — skip if empty
                    if (splitAfter >= 0) {
                        const children = []
                        for (let i = 0; i <= splitAfter; i++) {
                            children.push(textBlockNode.child(i))
                        }
                        // Skip if all children are empty paragraphs
                        const hasContent = children.some((c) => c.content.size > 0)
                        if (hasContent) {
                            fragments.push(textBlockType.create(null, children))
                        }
                    }

                    // Insert the custom block
                    fragments.push(schema.nodes[props.type].create(
                        { ...props.attrs, id },
                    ))

                    // Build second textBlock (children after splitAfter) — skip empty
                    const remaining = []
                    const startIdx = splitAfter + 1
                    for (let i = startIdx; i < textBlockNode.childCount; i++) {
                        remaining.push(textBlockNode.child(i))
                    }
                    // Filter out empty paragraphs at the edges
                    const nonEmpty = remaining.filter((c) => c.content.size > 0)
                    if (nonEmpty.length > 0) {
                        fragments.push(textBlockType.create(null, remaining))
                    }

                    const tr = editor.state.tr
                    tr.replaceWith(textBlockPos, textBlockPos + textBlockNode.nodeSize, fragments)
                    editor.view.dispatch(tr)
                },
            } satisfies Partial<SuggestionOptions<SlashCommandItem, SlashCommandItem>>,
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ]
    },
})
