import { useCallback, useEffect, useState } from "react"
import { Editor } from "./components/Editor"
import { Login } from "./components/Login"
import { pb } from "./pb"
import type { PbPage } from "./types"
import "./App.css"

function getSlugFromUrl(): string | null {
    const params = new URLSearchParams(window.location.search)
    return params.get("page")
}

export function App() {
    const [authenticated, setAuthenticated] = useState(pb.authStore.isValid)
    const [page, setPage] = useState<PbPage | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const slug = getSlugFromUrl()

    const loadPage = useCallback(async (slug: string) => {
        setLoading(true)
        setError("")
        try {
            const record = await pb.collection("pages").getFirstListItem<PbPage>(`slug="${slug}"`)
            setPage(record)
        } catch {
            setError(`Page "${slug}" not found`)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (authenticated && slug) {
            loadPage(slug)
        }
    }, [authenticated, slug, loadPage])

    function handleLogout() {
        pb.authStore.clear()
        setAuthenticated(false)
        setPage(null)
    }

    async function handleDuplicate() {
        if (!page) return
        const newSlug = `${page.slug}-copy`
        try {
            const record = await pb.collection("pages").create<PbPage>({
                title: `${page.title} (copy)`,
                slug: newSlug,
                excerpt: page.excerpt,
                date: page.date,
                cover: page.cover,
                doc: page.doc,
                tags: page.tags,
                published: false,
                draft: null,
            })
            window.location.search = `?page=${record.slug}`
        } catch (err) {
            console.error("Duplicate failed:", err)
            alert("Duplicate failed. Check console.")
        }
    }

    async function handleTogglePublished() {
        if (!page) return
        try {
            const updated = await pb.collection("pages").update<PbPage>(page.id, {
                published: !page.published,
            })
            setPage(updated)
        } catch (err) {
            console.error("Toggle published failed:", err)
            alert("Toggle published failed. Check console.")
        }
    }

    if (!authenticated) {
        return <Login onLogin={() => setAuthenticated(true)} />
    }

    if (!slug) {
        return (
            <div className="app-message">
                <p>
                    Add <code>?page=slug</code> to the URL to edit a page.
                </p>
                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )
    }

    if (loading) {
        return <div className="app-message">Loading...</div>
    }

    if (error) {
        return (
            <div className="app-message">
                <p className="app-error">{error}</p>
                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        )
    }

    if (!page) {
        return <div className="app-message">Loading...</div>
    }

    return (
        <div className="app">
            <header className="app-header">
                <span className="app-title">{page.title}</span>
                <span className="app-slug">/{page.slug}</span>
                <label className="app-published-toggle">
                    <input type="checkbox" checked={page.published} onChange={handleTogglePublished} />
                    Published
                </label>
                <button type="button" onClick={handleDuplicate}>
                    Duplicate
                </button>
                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </header>
            <main className="app-main">
                <Editor page={page} />
            </main>
        </div>
    )
}
