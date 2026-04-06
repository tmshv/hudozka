import { useState, useEffect, useCallback } from "react"
import { pb } from "./pb"
import { Login } from "./components/Login"
import { Editor } from "./components/Editor"
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
            const record = await pb.collection("pages").getFirstListItem<PbPage>(
                `slug="${slug}"`,
            )
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

    if (!authenticated) {
        return <Login onLogin={() => setAuthenticated(true)} />
    }

    if (!slug) {
        return (
            <div className="app-message">
                <p>Add <code>?page=slug</code> to the URL to edit a page.</p>
                <button onClick={handleLogout}>Logout</button>
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
                <button onClick={handleLogout}>Logout</button>
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
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main className="app-main">
                <Editor page={page} />
            </main>
        </div>
    )
}
