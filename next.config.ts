import type { NextConfig } from "next"

const config: NextConfig = {
    output: "standalone",
    trailingSlash: false,
    images: {
        remotePatterns: [
            { hostname: "hudozkacdn.tmshv.com" },
            { hostname: "images.weserv.nl" },
        ],
    },
}

export default config
