import { useState, useEffect, useRef } from "react"
import { pb } from "../pb"
import type { PbImage } from "../types"
import "./ImagePicker.css"

export type ImagePickerProps = {
    onSelect: (imageId: string) => void
    onClose: () => void
}

export function ImagePicker({ onSelect, onClose }: ImagePickerProps) {
    const [images, setImages] = useState<PbImage[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [tab, setTab] = useState<"browse" | "upload">("browse")
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadImages(page)
    }, [page])

    async function loadImages(p: number) {
        setLoading(true)
        try {
            const result = await pb.collection("images").getList<PbImage>(p, 20, {
                sort: "-created",
            })
            setImages(result.items)
            setTotalPages(result.totalPages)
        } catch (err) {
            console.error("Failed to load images:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpload() {
        const file = fileRef.current?.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            const record = await pb.collection("images").create<PbImage>({
                file,
                filename: file.name,
                width: 0,
                height: 0,
                alt: "",
                caption: "",
                blurhash: "",
            })
            onSelect(record.id)
        } catch (err) {
            console.error("Upload failed:", err)
            alert("Upload failed. Check console.")
        } finally {
            setUploading(false)
        }
    }

    function getThumbUrl(img: PbImage): string {
        return pb.files.getURL(img, img.file, { thumb: "150x150" })
    }

    return (
        <div className="picker-overlay" onClick={onClose}>
            <div className="picker" onClick={(e) => e.stopPropagation()}>
                <div className="picker-header">
                    <button
                        className={tab === "browse" ? "active" : ""}
                        onClick={() => setTab("browse")}
                    >
                        Browse
                    </button>
                    <button
                        className={tab === "upload" ? "active" : ""}
                        onClick={() => setTab("upload")}
                    >
                        Upload
                    </button>
                    <button className="picker-close" onClick={onClose}>×</button>
                </div>

                {tab === "browse" && (
                    <div className="picker-browse">
                        {loading ? (
                            <div className="picker-loading">Loading...</div>
                        ) : (
                            <div className="picker-grid">
                                {images.map((img) => (
                                    <button
                                        key={img.id}
                                        className="picker-thumb"
                                        onClick={() => onSelect(img.id)}
                                    >
                                        <img src={getThumbUrl(img)} alt={img.alt || img.filename} />
                                    </button>
                                ))}
                            </div>
                        )}
                        <div className="picker-pagination">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => p - 1)}
                            >
                                Prev
                            </button>
                            <span>{page} / {totalPages}</span>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {tab === "upload" && (
                    <div className="picker-upload">
                        <input type="file" accept="image/*" ref={fileRef} />
                        <button onClick={handleUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
