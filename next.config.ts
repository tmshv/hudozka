import type { NextConfig } from "next"

const config: NextConfig = {
    trailingSlash: false,
    images: {
        remotePatterns: [
            { hostname: "hudozkacdn.tmshv.com" },
            { hostname: "images.weserv.nl" },
        ],
    },
}

export default config
