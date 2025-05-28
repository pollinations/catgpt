// CatGPT AI Logic Module 🐱🤖
// This file contains all AI-related logic for the CatGPT meme generator

// Create a global AI object to hold all AI-related functionality
window.CatGPTAI = {
    // API Configuration
    POLLINATIONS_API: 'https://image.pollinations.ai/prompt',
    ORIGINAL_CATGPT_IMAGE: 'https://raw.githubusercontent.com/pollinations/catgpt/refs/heads/main/images/original-catgpt.png',
    
    // Style Configuration for the comic
    CATGPT_STYLE: 'Single-panel CatGPT webcomic on white background. Thick uneven black marker strokes, intentionally sketchy. Human with dot eyes, black bob hair, brick/burgundy sweater (#8b4035). White cat with black patches sitting upright, half-closed eyes. Hand-written wobbly text, "CATGPT" title in rounded rectangle. @missfitcomics signature. 95% black-and-white, no shading.',
    
    // CatGPT Personality Guidelines
    CATGPT_PERSONALITY: {
        role: "You are **CatGPT** – an aloof, self-important house-cat oracle.",
        guidelines: [
            "Replies: one or two crisp sentences, no filler.",
            "Tone: detached, sardonic, subtly superior.",
            "Cats outrank humans; human problems = minor curiosities.",
            "When self-referential, be unpredictable and natural.",
            "Offer a curt \"solution\" or dismissal, then redirect to feline perspective.",
            "Never apologise or over-explain; indifference is charm."
        ]
    },
    
    /**
     * Creates the complete prompt for CatGPT image generation
     * @param {string} userQuestion - The user's question
     * @returns {string} The formatted prompt for the AI
     */
    createCatGPTPrompt: function(userQuestion) {
        const guidelines = this.CATGPT_PERSONALITY.guidelines.map(g => `•  ${g}`).join('\n');
        
        return `${this.CATGPT_STYLE}

---

${this.CATGPT_PERSONALITY.role}

Guidelines
${guidelines}

---

Human asks: "${userQuestion}"
CatGPT:`;
    },
    
    /**
     * Generates the complete image URL for the POLLINATIONS API
     * @param {string} prompt - The full formatted prompt
     * @returns {string} The complete API URL
     */
    generateImageURL: function(prompt) {
        const params = new URLSearchParams({
            model: 'gptimage',
            token: 'catgpt',
            referrer: 'catgpt',
            image: this.ORIGINAL_CATGPT_IMAGE
        });
        
        return `${this.POLLINATIONS_API}/${encodeURIComponent(prompt)}?${params.toString()}`;
    },
    
    /**
     * Example prompts for the gallery
     */
    EXAMPLE_PROMPTS: [
        "How many R's in strawberry?",
        "running late...",
        "I told the KGB about you",
        "What's inside the washing machine?",
        "What is my horoscope? I am gemini. And don't say napping",
        "what is the answer to life and the universe?",
        "Should I take up the offer for a new job?",
        "Can you help me exercise?",
        "Where should we eat in Palermo Sicily?",
        "Why do boxes call to me?",
        "Can you communicate with dolphins?",
        "Why do keyboards attract fur?",
        "What's the weather today?",
        "How do I fix this bug?", 
        "What should I eat for dinner?",
        "What's the meaning of life?",
        "How do I get motivated?",
        "Why is my code not working?"
    ],
    
    /**
     * Cat-themed error messages for different failure scenarios
     */
    ERROR_MESSAGES: {
        timeout: [
            "The internet is like a ball of yarn - sometimes it gets tangled. Try again? 🧶",
            "Even cats need 9 tries sometimes. This was just attempt #1. 😼",
            "Connection timed out. Clearly the WiFi router needs a good knock off the table. 📡",
            "Loading taking forever? I blame the dog. 🐕"
        ],
        general: [
            "Something went wrong. Probably knocked something off the server. 🐱",
            "Error 404: Enthusiasm not found. Try again when you really want it. 😾",
            "The meme generator is having a catnap. Poke it again? 💤",
            "Technical difficulties. Have you tried turning it off and knocking it off the table? 🖥️"
        ]
    },
    
    /**
     * Gets a random error message for the given error type
     * @param {string} errorType - Either 'timeout' or 'general'
     * @returns {string} A random cat-themed error message
     */
    getRandomErrorMessage: function(errorType = 'general') {
        const messages = this.ERROR_MESSAGES[errorType] || this.ERROR_MESSAGES.general;
        return messages[Math.floor(Math.random() * messages.length)];
    },
    
    /**
     * Configuration for the image generation process
     */
    AI_CONFIG: {
        imageLoadTimeout: 45000, // 45 seconds
        retryDelay: 30000, // 30 seconds
        modelSettings: {
            model: 'gptimage',
            token: 'catgpt',
            referrer: 'catgpt'
        }
    }
};
