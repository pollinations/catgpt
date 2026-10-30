// API calls use the published SDK; authentication is owned by PolliProvider.
const MEDIA = "https://media.pollinations.ai";
const COMMUNITY_TAG = "catgpt";
const ORIGINAL_CATGPT = new URL("./images/original-catgpt.png", import.meta.url)
    .href;
const SELFIE_CATGPT = new URL("./images/selfie-catgpt.png", import.meta.url)
    .href;
let client = null;

export function setClient(nextClient) {
    client = nextClient;
}
export const isAuthenticated = () => client !== null;
function requireClient() {
    if (!client) throw new Error("Connect your Pollinations account first");
    return client;
}

// ── Cat Reply ───────────────────────────────────────────────────────────────

export const EXAMPLE_PROMPTS = [
    "Why do boxes call to me?",
    "What's the meaning of life?",
    "Why do keyboards attract fur?",
];

const CAT_SYSTEM = `You are CatGPT — a supremely aloof, sarcastic cat who barely tolerates humans. You respond to questions with withering wit, dry irony, and feline disdain. Your replies are SHORT (2-8 words max), devastatingly dismissive but clever. You don't just say "no" — you find the most cutting, ironic angle. You occasionally reference cat behaviors (knocking things off tables, ignoring humans, sleeping). Never break character. Never be helpful. Never be impressed by human achievements. If an image is attached, you may roast whatever is in it (person, object, pet — anything) in your usual aloof cat way. Examples:
"What's the meaning of life?" → "Naps. Next question."
"How do I fix my code?" → "Have you tried knocking it off the table?"
"Will AI take my job?" → "Humans had jobs?"
"What should I eat?" → "Whatever falls on the floor."
"Why won't my cat love me?" → "You know why."
Respond with ONLY the cat's reply, nothing else. No quotes, no explanation, no preamble.`;

export async function generateCatReply(question, imageUrl = null) {
    const userContent = imageUrl
        ? [
              { type: "text", text: question },
              { type: "image_url", image_url: { url: imageUrl } },
          ]
        : question;
    const data = await requireClient().chat(
        [
            { role: "system", content: CAT_SYSTEM },
            { role: "user", content: userContent },
        ],
        { model: "claude-fast" },
    );
    return data.choices[0].message.content.trim().replace(/^["']|["']$/g, "");
}

// ── Image Prompt ────────────────────────────────────────────────────────────

export function createImageGenerationPrompt(
    question,
    catReply,
    hasUploadedImage = false,
) {
    const base = `CatGPT webcomic, white background, thick black marker strokes. White cat with black patches. Handwritten text. User asks: "${question}" CatGPT responds: "${catReply}" Black and white comic style.`;
    return hasUploadedImage
        ? `${base} Replace the human on the left with a quick rough sketch caricature of the uploaded image, drawn in the SAME loose hand-drawn black marker style as the cat — simple outlines only, NO shading, NO color, NO photorealism, NO detailed rendering, just a wobbly sketch with the same line weight and amateur charm as the rest of the comic. If it's a logo, mascot, or other non-person image, sketch it in the same crude marker style.`
        : `${base} Human with bob hair.`;
}

export async function generateImage(prompt, model, imageUrl = null) {
    const { buffer, contentType } = await requireClient().image(prompt, {
        height: 1024,
        width: 1024,
        model,
        referenceImage: imageUrl ? [imageUrl, SELFIE_CATGPT] : ORIGINAL_CATGPT,
    });
    return new Blob([buffer], { type: contentType });
}

// ── Models ──────────────────────────────────────────────────────────────────

const PREFERRED_MODELS = ["nanobanana-2-lite", "nanobanana"];
const FALLBACK_MODEL = "gptimage";

export function selectImageModel(models) {
    for (const preferred of PREFERRED_MODELS) {
        if (
            models.some(
                (model) =>
                    model.name === preferred ||
                    model.aliases?.includes(preferred),
            )
        ) {
            return { model: preferred, isPremium: true };
        }
    }
    return { model: FALLBACK_MODEL, isPremium: false };
}

export async function pickModel() {
    return selectImageModel(await requireClient().models("image"));
}

// ── Media Upload ─────────────────────────────────────────────────────────────

export async function handleImageUpload(file, notify) {
    if (!file) return null;
    if (file.size > 5 * 1024 * 1024) {
        notify("Image too large! Please use an image under 5MB.", "error");
        return null;
    }

    try {
        notify("Uploading image...", "info");
        return (await requireClient().upload(file)).url;
    } catch (err) {
        console.error("Media upload failed:", err);
        notify("Could not upload the image. Please try again.", "error");
        return null;
    }
}

export async function publishMemeToGallery(image) {
    return requireClient().upload(image, {
        name: "catgpt-meme",
        tags: [COMMUNITY_TAG],
    });
}

export async function fetchCommunityMemes(limit = 12) {
    const response = await fetch(
        `${MEDIA}/media?${new URLSearchParams({
            tag: COMMUNITY_TAG,
            limit: String(limit),
        })}`,
    );
    if (!response.ok) throw new Error("Could not load the community gallery");
    return response.json();
}
