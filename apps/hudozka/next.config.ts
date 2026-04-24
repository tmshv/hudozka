import type { NextConfig } from "next"
import path from "node:path"

const config: NextConfig = {
    output: "standalone",
    outputFileTracingRoot: path.join(process.cwd(), "../../"),
    trailingSlash: false,
    images: {
        remotePatterns: [
            { hostname: "hudozka.shlisselburg.org" },
            { hostname: "images.weserv.nl" },
            { hostname: "127.0.0.1" },
        ],
    },
}

export default config
