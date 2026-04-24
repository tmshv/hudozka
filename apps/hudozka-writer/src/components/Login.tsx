import { useState } from "react"
import type { FormEvent } from "react"
import { pb } from "../pb"
import "./Login.css"

export type LoginProps = {
    onLogin: () => void
}

export function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            await pb.collection("_superusers").authWithPassword(email, password)
            onLogin()
        } catch {
            setError("Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login">
            <form className="login-form" onSubmit={handleSubmit}>
                <h1>Hudozka Writer</h1>
                {error && <p className="login-error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    )
}
