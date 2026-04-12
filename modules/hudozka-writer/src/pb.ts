import PocketBase from "pocketbase"

// Default to same origin; override via env for dev
const url = import.meta.env.VITE_PB_URL ?? "http://127.0.0.1:8090"

export const pb = new PocketBase(url)
pb.autoCancellation(false)
