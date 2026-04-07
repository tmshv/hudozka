import { Extension } from "@tiptap/core"
import { PluginKey } from "@tiptap/pm/state"
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
    { label: "Text", type: "paragraph" },
    { label: "Image", type: "imageBlock", attrs: { id: "", imageId: "", wide: false, caption: "" } },
    { label: "File", type: "documentBlock", attrs: { id: "", fileId: "", title: "" } },
    { label: "Embed", type: "embedBlock", attrs: { id: "", src: "" } },
    { label: "Card Grid", type: "cardGridBlock", attrs: { id: "", items: "[]" } },
]

const slashCommandsPluginKey = new PluginKey("slashCommands")

function SlashMenu({ items, command }: { items: SlashCommandItem[]; command: (item: SlashCommandItem) => void }) {
    if (items.length === 0) return null

    return (
        <div className="slash-menu">
            {items.map((item) => (
                <button
                    key={item.type}
                    className="slash-menu-item"
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

                            root.render(
                                <SlashMenu
                                    items={props.items}
                                    command={props.command}
                                />
                            )
                        },
                        onUpdate: (props: SuggestionProps<SlashCommandItem, SlashCommandItem>) => {
                            if (!root || !container) return

                            const rect = props.clientRect?.()
                            if (rect && container) {
                                container.style.left = `${rect.left}px`
                                container.style.top = `${rect.bottom + 4}px`
                            }

                            root.render(
                                <SlashMenu
                                    items={props.items}
                                    command={props.command}
                                />
                            )
                        },
                        onExit: () => {
                            root?.unmount()
                            container?.remove()
                            container = null
                            root = null
                        },
                        onKeyDown: (props: SuggestionKeyDownProps) => {
                            if (props.event.key === "Escape") {
                                root?.unmount()
                                container?.remove()
                                container = null
                                root = null
                                return true
                            }
                            return false
                        },
                    }
                },
                command: ({ editor, range, props }: { editor: Editor; range: { from: number; to: number }; props: SlashCommandItem }) => {
                    // Delete the slash command text
                    editor.chain().focus().deleteRange(range).run()

                    if (props.type === "paragraph") {
                        // Already have an empty paragraph from deleting the range
                        return
                    }

                    const id = generateBlockId()
                    editor.chain().focus().insertContentAt(editor.state.selection.from, {
                        type: props.type,
                        attrs: { ...props.attrs, id },
                    }).run()
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
