import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { Pollinations } from "@pollinations/sdk";
import {
    createImageGenerationPrompt,
    fetchCommunityMemes,
    generateCatReply,
    handleImageUpload,
    pickModel,
    publishMemeToGallery,
    setClient,
} from "../ai.js";
import { safeMediaUrl, shareUrl } from "../links.js";

const key = process.env.POLLINATIONS_API_KEY;
assert.ok(key, "Set POLLINATIONS_API_KEY for the live check");
const client = new Pollinations({ apiKey: key });
const base =
    process.env.CATGPT_REFERENCE_BASE || "https://catgpt.pollinations.app";
setClient(client);
try {
    const { model } = await pickModel();
    const question = "Why do cats ignore deployment checklists?";
    const reference = await handleImageUpload(
        new File(
            [
                await readFile(
                    new URL("../images/original-catgpt.png", import.meta.url),
                ),
            ],
            "catgpt-reference.png",
            { type: "image/png" },
        ),
        () => {},
    );
    assert.ok(reference?.startsWith("https://media.pollinations.ai/"));
    const reply = await generateCatReply(question, reference);
    assert.ok(reply.length > 0);
    // Use a public reference origin: providers cannot fetch a developer's localhost.
    const result = await client.image(
        createImageGenerationPrompt(question, reply, true),
        {
            model,
            height: 1024,
            width: 1024,
            referenceImage: [reference, `${base}/images/selfie-catgpt.png`],
        },
    );
    assert.ok(result.buffer.byteLength > 1000);
    assert.ok(result.contentType.startsWith("image/"));
    const published = await publishMemeToGallery(
        new Blob([result.buffer], { type: result.contentType }),
    );
    assert.ok(safeMediaUrl(published.url, base));
    assert.ok(!published.url.includes(key));
    const response = await fetch(published.url);
    assert.ok(response.ok);
    assert.equal(
        (await response.arrayBuffer()).byteLength,
        result.buffer.byteLength,
    );
    const gallery = await fetchCommunityMemes();
    assert.ok(
        gallery.items.some(
            (item) => item.id === published.id || item.url === published.url,
        ),
    );
    const shared = shareUrl(
        `${base}/?prompt=${encodeURIComponent(question)}&image=${encodeURIComponent(reference)}`,
    );
    assert.ok(!shared.includes(key));
    if (process.env.CATGPT_TEST_IMAGE_PATH)
        await writeFile(
            process.env.CATGPT_TEST_IMAGE_PATH,
            Buffer.from(result.buffer),
        );
    console.log(
        JSON.stringify({
            status: "PASS",
            model,
            imageBytes: result.buffer.byteLength,
            referenceUpload: true,
            textGeneration: true,
            imageGeneration: true,
            galleryUpload: true,
            download: true,
            galleryListed: true,
            keylessSharing: true,
            publishedUrl: published.url,
        }),
    );
} catch (error) {
    console.error(String(error.message).replaceAll(key, "[REDACTED]"));
    process.exitCode = 1;
} finally {
    setClient(null);
}
