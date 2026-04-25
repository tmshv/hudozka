import { useEffect, useRef, useState } from "react"
import { pb } from "../pb"
import type { PbFile } from "../types"
import "./FilePicker.css"

export type FilePickerProps = {
    onSelect: (fileId: string) => void
    onClose: () => void
}

export function FilePicker({ onSelect, onClose }: FilePickerProps) {
    const [files, setFiles] = useState<PbFile[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [tab, setTab] = useState<"browse" | "upload">("browse")
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        pb.collection("files")
            .getList<PbFile>(page, 20, { sort: "-created" })
            .then(result => {
                if (cancelled) return
                setFiles(result.items)
                setTotalPages(result.totalPages)
            })
            .catch(err => {
                if (!cancelled) console.error("Failed to load files:", err)
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [page])

    async function handleUpload() {
        const file = fileRef.current?.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const record = await pb.collection("files").create<PbFile>({
                file,
                filename: file.name,
            })
            onSelect(record.id)
        } catch (err) {
            console.error("Upload failed:", err)
            alert("Upload failed. Check console.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div
            className="picker-overlay"
            onClick={onClose}
            onKeyDown={e => {
                if (e.key === "Escape") onClose()
            }}
        >
            <div
                className="picker"
                onClick={e => e.stopPropagation()}
                onKeyDown={e => {
                    e.stopPropagation()
                }}
            >
                <div className="picker-header">
                    <button type="button" className={tab === "browse" ? "active" : ""} onClick={() => setTab("browse")}>
                        Browse
                    </button>
                    <button type="button" className={tab === "upload" ? "active" : ""} onClick={() => setTab("upload")}>
                        Upload
                    </button>
                    <button type="button" className="picker-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                {tab === "browse" && (
                    <div className="picker-browse">
                        {loading ? (
                            <div className="picker-loading">Loading...</div>
                        ) : (
                            <div className="file-picker-list">
                                {files.map(f => (
                                    <button
                                        type="button"
                                        key={f.id}
                                        className="file-picker-item"
                                        onClick={() => onSelect(f.id)}
                                    >
                                        <span className="file-picker-icon">📎</span>
                                        <span className="file-picker-name">{f.filename}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="picker-pagination">
                            <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                                Prev
                            </button>
                            <span>
                                {page} / {totalPages}
                            </span>
                            <button type="button" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {tab === "upload" && (
                    <div className="picker-upload">
                        <input type="file" ref={fileRef} />
                        <button type="button" onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
