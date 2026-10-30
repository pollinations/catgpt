import { once } from "node:events";
import { createServer } from "node:http";
import { Pollinations } from "@pollinations/sdk";
import { afterEach, expect, it } from "vitest";
import { generateImage, selectImageModel, setClient } from "./ai.js";
import { safeMediaUrl, shareUrl } from "./links.js";

afterEach(() => setClient(null));

it.each([
    { name: "nanobanana-2-lite", aliases: [] },
    {
        name: "google/gemini-3.1-flash-lite-image",
        aliases: ["nanobanana-2-lite"],
    },
])("accepts the preferred model's canonical ID or alias", (model) => {
    expect(selectImageModel([model])).toEqual({
        model: "nanobanana-2-lite",
        isPremium: true,
    });
});

it("keeps the second image model when the first is unavailable", () => {
    expect(
        selectImageModel([
            { name: "google/gemini-2.5-flash-image", aliases: ["nanobanana"] },
        ]),
    ).toEqual({ model: "nanobanana", isPremium: true });
});

it("keeps the existing image fallback", () => {
    expect(selectImageModel([])).toEqual({
        model: "gptimage",
        isPremium: false,
    });
});

it("sends image credentials only in the HTTP header through the published SDK", async () => {
    let request;
    const server = createServer((req, res) => {
        request = { url: req.url, authorization: req.headers.authorization };
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end("image bytes");
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    try {
        setClient(
            new Pollinations({
                apiKey: "test-image-credential",
                baseUrl: `http://127.0.0.1:${server.address().port}`,
            }),
        );
        const image = await generateImage(
            "a cat",
            "gptimage",
            "https://example.com/reference.png",
        );
        expect(await image.text()).toBe("image bytes");
        expect(image.type).toBe("image/png");
        expect(request.authorization).toBe("Bearer test-image-credential");
        expect(request.url).not.toContain("test-image-credential");
        expect(
            new URL(request.url, "http://localhost").searchParams.has("key"),
        ).toBe(false);
        expect(
            new URL(request.url, "http://localhost").searchParams.get("image"),
        ).toContain("https://example.com/reference.png");
    } finally {
        server.closeAllConnections();
        await new Promise((resolve) => server.close(resolve));
    }
});

it("requires login before generating an image", async () => {
    await expect(generateImage("a cat", "gptimage")).rejects.toThrow(
        "Connect your Pollinations account first",
    );
});

it.each([
    "https://gen.pollinations.ai/image/cat?key=old-secret",
    "https://example.com/image#api_key=old-secret",
    "https://user:password@example.com/image",
    "javascript:alert(1)",
])("rejects unsafe saved or reference URLs: %s", (value) => {
    expect(safeMediaUrl(value, "https://catgpt.pollinations.app/")).toBeNull();
});

it("shares only prompt/model and a keyless reference, never an auth callback", () => {
    const shared = shareUrl(
        "https://catgpt.pollinations.app/?prompt=Hello&model=gptimage&code=oauth-code&state=oauth-state&api_key=old-secret&image=https%3A%2F%2Fexample.com%2Fcat%3Fkey%3Dold-secret#access_token=old-secret",
    );
    expect(shared).toBe(
        "https://catgpt.pollinations.app/?prompt=Hello&model=gptimage",
    );
    expect(
        shareUrl(
            "https://catgpt.pollinations.app/?image=https%3A%2F%2Fmedia.pollinations.ai%2Fpublic-image",
        ),
    ).toContain("image=https%3A%2F%2Fmedia.pollinations.ai%2Fpublic-image");
});
