const CREDENTIAL_PARAMS =
    /^(key|api_key|access_token|refresh_token|token|authorization|code|state)$/i;

export function safeMediaUrl(value, base) {
    if (!value || typeof value !== "string") return null;
    try {
        const url = new URL(value, base);
        if (!["http:", "https:", "blob:"].includes(url.protocol)) return null;
        if (url.username || url.password) return null;
        if (
            [...url.searchParams.keys()].some((name) =>
                CREDENTIAL_PARAMS.test(name),
            )
        )
            return null;
        if (
            [...new URLSearchParams(url.hash.slice(1)).keys()].some((name) =>
                CREDENTIAL_PARAMS.test(name),
            )
        )
            return null;
        return url.href;
    } catch {
        return null;
    }
}

export function shareUrl(value) {
    const source = new URL(value);
    const result = new URL(source.pathname, source.origin);
    for (const name of ["prompt", "model"]) {
        if (source.searchParams.has(name))
            result.searchParams.set(name, source.searchParams.get(name));
    }
    const image = safeMediaUrl(source.searchParams.get("image"), source.href);
    if (image?.startsWith("https://")) result.searchParams.set("image", image);
    return result.href;
}
