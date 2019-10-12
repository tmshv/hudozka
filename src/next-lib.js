export async function requestGet(url, defaultResponse) {
    try {
        const res = await axios.get(url)

        return res.data
    } catch (e) {
        return defaultResponse
    }
}

export function createApiUrl(req, path) {
    const { origin } = absoluteUrl(req, 'localhost:3000')

    return `${origin}${path}`
}

function absoluteUrl(req, defaultLocalhost) {
    var protocol = 'https:';
    var host = req
        ? (req.headers['x-forwarded-host'] || req.headers['host'])
        : window.location.host;
    host = host || defaultLocalhost
    if (host.indexOf('localhost') > -1) {
        if (defaultLocalhost) host = defaultLocalhost;
        protocol = 'http:';
    }

    return {
        protocol: protocol,
        host: host,
        origin: protocol + '//' + host
    };
}
