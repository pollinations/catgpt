
const POLLINATIONS_API = 'https://gen.pollinations.ai/image';
const ORIGINAL_CATGPT_IMAGE = 'https://raw.githubusercontent.com/pollinations/catgpt/refs/heads/main/images/original-catgpt.png';
const CATGPT_STYLE = 'Single-panel CatGPT webcomic on white background. Thick uneven black marker strokes, intentionally sketchy. Human with dot eyes, black bob hair, brick/burgundy sweater (#8b4035). White cat with black patches sitting upright, half-closed eyes. Hand-written wobbly text, "CATGPT" title in rounded rectangle. @missfitcomics signature. 95% black-and-white, no shading.';
const CATGPT_PERSONALITY = `You are **CatGPT** – an aloof, self-important house-cat oracle.

Guidelines
•  Replies: one or two crisp sentences, no filler.  
•  Tone: detached, sardonic, subtly superior.  
•  Cats outrank humans; human problems = minor curiosities.  
•  When self-referential, be unpredictable and natural.
•  Offer a curt "solution" or dismissal, then redirect to feline perspective.  
•  Never apologise or over-explain; indifference is charm.`;

const EXAMPLES_MAP = new Map([
    ["What is my horoscope? I am gemini. And don't say napping", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22What%20is%20my%20horoscope%3F%20I%20am%20gemini.%20And%20don't%20say%20napping%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["what is the answer to life and the universe?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22what%20is%20the%20answer%20to%20life%20and%20the%20universe%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["Should I take up the offer for a new job?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22Should%20I%20take%20up%20the%20offer%20for%20a%20new%20job%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["Can you help me exercise?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22Can%20you%20help%20me%20exercise%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["Where should we eat in Palermo Sicily?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22Where%20should%20we%20eat%20in%20Palermo%20Sicily%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["Why do boxes call to me?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22Why%20do%20boxes%20call%20to%20me%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["Can you communicate with dolphins?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22Can%20you%20communicate%20with%20dolphins%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["Why do keyboards attract fur?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22Why%20do%20keyboards%20attract%20fur%3F%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
    ["What's the weather today?", "https://gen.pollinations.ai/image/Single-panel%20CatGPT%20webcomic%2C%20white%20background%2C%20thick%20black%20marker%20strokes.%20White%20cat%20with%20black%20patches%2C%20human%20with%20bob%20hair.%20Handwritten%20text.%20%22what's%20the%20weather%20today%22%20CatGPT%20responds%20sarcastically%20as%20an%20aloof%20cat.%20Black%20and%20white%20comic%20style.?height=1024&width=1024&model=gptimage&enhance=true&image=https%3A%2F%2Fraw.githubusercontent.com%2Fpollinations%2Fcatgpt%2Frefs%2Fheads%2Fmain%2Fimages%2Foriginal-catgpt.png"],
]);

function createCatGPTPrompt(userQuestion) {
    return `${CATGPT_STYLE}

---

${CATGPT_PERSONALITY}

---

Human asks: "${userQuestion}"
CatGPT:`;
}

function createImageGenerationPrompt(userQuestion) {
    return `Single-panel CatGPT webcomic, white background, thick black marker strokes. White cat with black patches, human with bob hair. Handwritten text.

IMPORTANT: CatGPT's response MUST be 2-5 words ONLY. Make it funny, sarcastic, and dismissive. Examples: "Not your problem.", "I'd rather nap.", "Hard pass, human."

Human asks: "${userQuestion}"
CatGPT responds (2-5 words, funny):`;
}

function generateImageURL(prompt) {
    return `${POLLINATIONS_API}/${encodeURIComponent(prompt)}?height=1024&width=1024&model=gptimage&enhance=true&image=${encodeURIComponent(ORIGINAL_CATGPT_IMAGE)}`;
}

async function fetchImageWithAuth(imageUrl) {
    const response = await fetch(imageUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer pk_w3kAO902fOeFYiNm'
        }
    });
    
    
    if (!response.ok) {
        let errorDetails = '';
        try {
            const errorData = await response.json();
            errorDetails = errorData.error?.message || JSON.stringify(errorData);
        } catch (e) {
            errorDetails = await response.text();
        }
        
        // Log detailed error for debugging only (console)
        console.error('API Error Details:', {
            status: response.status,
            statusText: response.statusText,
            details: errorDetails,
            url: imageUrl
        });
        
        // Don't expose backend errors to users - throw generic error
        throw new Error(`API_ERROR_${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

function saveGeneratedMeme(prompt, blobUrl) {
    const saved = getSavedMemes();
    const now = Date.now();
    const newMeme = { prompt, url: blobUrl, timestamp: now };
    const updated = [newMeme, ...saved.filter(m => m.prompt !== prompt)].slice(0, 8);
    localStorage.setItem('catgpt-generated', JSON.stringify(updated));
}

function getSavedMemes() {
    try {
        const data = JSON.parse(localStorage.getItem('catgpt-generated')) || [];
        cleanupOldMemes(data);
        return data;
    } catch {
        return [];
    }
}

function getSavedPrompts() {
    return getSavedMemes().map(m => m.prompt);
}

function cleanupOldMemes(memes) {
    const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const filtered = memes.filter(m => (now - m.timestamp) < ONE_MONTH);
    if (filtered.length !== memes.length) {
        localStorage.setItem('catgpt-generated', JSON.stringify(filtered));
    }
    return filtered;
}

function getURLPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('prompt');
}

function setURLPrompt(prompt) {
    const url = new URL(window.location);
    if (prompt) {
        url.searchParams.set('prompt', prompt);
    } else {
        url.searchParams.delete('prompt');
    }
    window.history.replaceState({}, '', url);
}

function handleURLPrompt() {
    const urlPrompt = getURLPrompt();
    if (urlPrompt) {
        userInput.value = urlPrompt;
        setTimeout(() => {
            generateMeme();
        }, 500);
    }
}

const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultSection = document.getElementById('resultSection');
const generatedMeme = document.getElementById('generatedMeme');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const examplesGrid = document.getElementById('examplesGrid');
const yourMemesGrid = document.getElementById('yourMemesGrid');

document.addEventListener('DOMContentLoaded', () => {
    cleanupOldMemes(getSavedMemes());
    loadUserMemes();
    loadExamples();
    loadRandomCatFact();
    handleURLPrompt();
    
    generateBtn.addEventListener('click', generateMeme);
    downloadBtn.addEventListener('click', downloadMeme);
    shareBtn.addEventListener('click', shareMeme);
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateMeme();
        }
    });
    
    addFloatingEmojis();
});

async function generateMeme() {
    const userQuestion = userInput.value.trim();
    
    if (!userQuestion) {
        showNotification('Please enter a question for CatGPT! 😸', 'warning');
        return;
    }
    
    setURLPrompt(userQuestion);
    
    generateBtn.disabled = true;
    generateBtn.innerHTML = '🐾 Generating... (~30s)';
    generateBtn.style.opacity = '0.6';
    generateBtn.style.cursor = 'not-allowed';
    
    loadingIndicator.classList.remove('hidden');
    resultSection.classList.add('hidden');
    
    startFakeProgress();
    startCatAnimation();
    
    const fullPrompt = createCatGPTPrompt(userQuestion);
    const imagePrompt = createImageGenerationPrompt(userQuestion);
    
    try {
        const imageUrl = generateImageURL(imagePrompt);
        
        let imageLoadTimeout;
        
        imageLoadTimeout = setTimeout(() => {
            resetButton();
            handleImageError('timeout');
        }, 60000);
        
        try {
            const blobUrl = await fetchImageWithAuth(imageUrl);
            clearTimeout(imageLoadTimeout);
            generatedMeme.src = blobUrl;
            showResult();
            resetButton();
            stopCatAnimation();
            saveGeneratedMeme(userQuestion, imageUrl);
            refreshExamples();
        } catch (fetchError) {
            clearTimeout(imageLoadTimeout);
            console.error('Generation error:', fetchError);
            resetButton();
            handleImageError('general');
        }
        
    } catch (error) {
        console.error('Error generating meme:', error);
        resetButton();
        handleImageError('general');
    }
}

function handleImageError(errorType = 'general', errorMessage = '') {
    const catMessages = [
        "😾 *yawns* The art studio is full of sleeping cats... try again in 30 seconds!",
        "🐱 *stretches paws* Too many humans asking questions! I need a catnap... wait 30 seconds, please.",
        "😸 *knocks over coffee* Oops! The meme machine broke. Give me 30 seconds to fix it with my paws.",
        "🙄 *rolls eyes* Seriously? Another request? The queue is fuller than my food bowl... try in 30 seconds.",
        "😴 *curls up* All the AI cats are napping right now. Check back in 30 seconds, human.",
        "🐾 *walks across keyboard* Purrfect timing... NOT. The servers are as full as a litter box. 30 seconds!",
        "😼 *flicks tail dismissively* The internet tubes are clogged with cat hair. Try again in 30 seconds.",
        "🎨 *knocks over paint* My artistic genius is in high demand! Wait your turn... 30 seconds, human."
    ];
    
    const randomMessage = catMessages[Math.floor(Math.random() * catMessages.length)];
    
    let specificMessage;
    if (errorType === 'timeout') {
        specificMessage = "⏰ This cat took too long to respond... probably distracted by a laser pointer! " + randomMessage;
    } else {
        specificMessage = randomMessage;
    }
    
    showNotification(specificMessage, 'error');
    stopCatAnimation();
    
    startRetryCountdown();
}

function startRetryCountdown() {
    let countdown = 10;
    
    startCatAnimation('retry');
    
    const retryContainer = document.createElement('div');
    retryContainer.id = 'retryContainer';
    retryContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff61d8, #05ffa1);
        color: white;
        padding: 2rem;
        border-radius: 20px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255,255,255,0.2);
        font-family: 'Space Grotesk', sans-serif;
        min-width: 300px;
    `;
    
    const title = document.createElement('h3');
    title.style.cssText = `
        margin: 0 0 1rem 0;
        font-size: 1.5rem;
        text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    `;
    title.innerHTML = '😸 CatGPT is blowing up rn...';
    
    const countdownDisplay = document.createElement('div');
    countdownDisplay.style.cssText = `
        font-size: 4rem;
        font-weight: 700;
        margin: 1rem 0;
        animation: pulse 1s infinite;
        text-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    
    const subtitle = document.createElement('p');
    subtitle.style.cssText = `
        margin: 1rem 0 0 0;
        opacity: 0.9;
        font-size: 1rem;
    `;
    subtitle.innerHTML = 'The whole internet wants cat wisdom! Auto-retry in... 🐾';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = 'Cancel ❌';
    cancelBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.3);
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 1rem;
        transition: all 0.3s;
    `;
    
    retryContainer.appendChild(title);
    retryContainer.appendChild(countdownDisplay);
    retryContainer.appendChild(subtitle);
    retryContainer.appendChild(cancelBtn);
    document.body.appendChild(retryContainer);
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            retryContainer.remove();
            stopCatAnimation();
            generateMeme();
        }
    }, 1000);
    
    cancelBtn.addEventListener('click', () => {
        clearInterval(countdownInterval);
        retryContainer.remove();
        stopCatAnimation();
    });
    
    countdownDisplay.textContent = countdown;
}

let catAnimationInterval;

function startCatAnimation(mode = 'loading') {
    const loadingCatEmojis = ['🐱', '😺', '😸', '😹', '😻', '🙀', '😿', '😾', '🐈', '🐈‍⬛'];
    const retryCatEmojis = ['😾', '😿', '🙄', '😤', '😑', '😒', '😔', '🐱‍👤', '😸', '😼'];
    
    const catEmojis = mode === 'retry' ? retryCatEmojis : loadingCatEmojis;
    const speed = mode === 'retry' ? 800 : 400;
    
    catAnimationInterval = setInterval(() => {
        const cat = document.createElement('div');
        const animationName = mode === 'retry' ? 'catSlowWalk' : 'catSlide';
        
        cat.style.cssText = `
            position: fixed;
            font-size: ${2 + Math.random() * 2}rem;
            z-index: 999;
            pointer-events: none;
            top: ${Math.random() * 100}vh;
            left: -100px;
            animation: ${animationName} ${3 + Math.random() * 2}s linear forwards;
        `;
        
        cat.textContent = catEmojis[Math.floor(Math.random() * catEmojis.length)];
        document.body.appendChild(cat);
        
        setTimeout(() => {
            if (cat.parentNode) {
                cat.remove();
            }
        }, 6000);
    }, speed);
}

function stopCatAnimation() {
    if (catAnimationInterval) {
        clearInterval(catAnimationInterval);
        catAnimationInterval = null;
    }
    
    document.querySelectorAll('[style*="catSlide"]').forEach(cat => cat.remove());
}

function resetButton() {
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Generate CatGPT Meme 🎨';
    generateBtn.style.opacity = '1';
    generateBtn.style.cursor = 'pointer';
    loadingIndicator.classList.add('hidden');
    stopFakeProgress();
    stopCatAnimation();
}

let progressInterval;
let progressStep = 0;

function startFakeProgress() {
    const progressMessages = [
        "🧠 Waking up CatGPT... (this cat is sleepy)",
        "☕ Brewing digital coffee for maximum sass...",
        "🎨 Sketching with chaotic energy...",
        "😼 Teaching AI the art of being unimpressed...",
        "📝 Writing sarcastic responses in Comic Sans...",
        "🌙 Channeling midnight cat energy...",
        "✨ Sprinkling some magic dust...",
        "🎯 Perfecting the level of 'couldn't care less'...",
        "🔥 Making it fire (but like, ironically)...",
        "🎭 Adding just the right amount of drama...",
        "💅 Polishing those aloof vibes...",
        "🚀 Almost done! (CatGPT doesn't rush for anyone)"
    ];
    
    progressStep = 0;
    const progressText = document.createElement('div');
    progressText.id = 'progress-text';
    progressText.style.cssText = `
        text-align: center;
        font-size: 0.9rem;
        color: var(--color-primary);
        margin-top: 1rem;
        font-weight: 500;
        animation: pulse 2s infinite;
    `;
    
    loadingIndicator.appendChild(progressText);
    
    progressInterval = setInterval(() => {
        if (progressStep < progressMessages.length) {
            progressText.textContent = progressMessages[progressStep];
            progressStep++;
        } else {
            progressText.textContent = "🎨 Finalizing your masterpiece...";
        }
    }, 2500);
    
    progressText.textContent = progressMessages[0];
    progressStep = 1;
}

function stopFakeProgress() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
    const progressText = document.getElementById('progress-text');
    if (progressText) {
        progressText.remove();
    }
}

function showResult() {
    resultSection.classList.remove('hidden');
    
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    celebrate();
}

async function downloadMeme() {
    try {
        const response = await fetch(generatedMeme.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `catgpt-meme-${Date.now()}.png`;
        link.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('Meme downloaded! 🎉', 'success');
    } catch (error) {
        console.error('Download failed:', error);
        showNotification('Download failed! Try right-clicking and save image instead.', 'error');
    }
}


async function shareMeme() {
    if (!generatedMeme.src || generatedMeme.src === '') {
        showNotification('Generate a meme first! 🎨', 'warning');
        return;
    }
    
    const currentURL = window.location.href;
    
    try {
        await navigator.clipboard.writeText(currentURL);
        showNotification('Link copied to clipboard! 📋', 'success');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
        showNotification('Could not copy link. Try copying it manually! 🔗', 'error');
    }
}



function loadUserMemes() {
    yourMemesGrid.innerHTML = '';
    
    const savedMemes = getSavedMemes();
    
    if (savedMemes.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No memes yet! Generate one to see it here. 🎨';
        emptyMessage.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            color: var(--color-secondary);
            padding: 2rem;
            font-style: italic;
        `;
        yourMemesGrid.appendChild(emptyMessage);
        return;
    }
    
    // Show ONLY user-generated memes from localStorage
    savedMemes.forEach((meme, index) => {
        const card = createUserMemeCard(meme.prompt, index, meme.url);
        if (card) yourMemesGrid.appendChild(card);
    });
}

function loadExamples() {
    examplesGrid.innerHTML = '';
    
    // Show ONLY examples from EXAMPLES_MAP
    const examplePrompts = Array.from(EXAMPLES_MAP.keys());
    examplePrompts.forEach((prompt, index) => {
        const card = createExampleCard(prompt, index);
        if (card) examplesGrid.appendChild(card);
    });
}

function refreshExamples() {
    loadUserMemes();
    loadExamples();
}

function createUserMemeCard(prompt, index, imageUrl) {
    // User memes: use stored public URL from localStorage
    if (!imageUrl) {
        console.warn(`User meme has no URL: "${prompt}"`);
        return null;
    }
    
    const card = document.createElement('div');
    card.className = 'example-card';
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.border = '2px solid var(--color-accent)';
    card.style.boxShadow = '0 0 10px rgba(255, 105, 180, 0.3)';
    
    // Display the stored image from public URL
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = prompt;
    img.loading = 'lazy';
    
    const badge = document.createElement('div');
    badge.textContent = '✨ Your Meme';
    badge.style.cssText = `
        background: var(--gradient-1);
        color: white;
        padding: 0.2rem 0.5rem;
        border-radius: 10px;
        font-size: 0.7rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        text-align: center;
    `;
    
    const promptText = document.createElement('p');
    promptText.textContent = `"${prompt}"`;
    promptText.style.fontStyle = 'italic';
    promptText.style.fontSize = '0.9rem';
    promptText.style.color = 'var(--color-primary)';
    promptText.style.textAlign = 'center';
    promptText.style.margin = '0.5rem 0';
    
    card.appendChild(badge);
    card.appendChild(img);
    card.appendChild(promptText);
    
    card.addEventListener('click', () => {
        userInput.value = prompt;
        userInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        userInput.focus();
        
        userInput.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            userInput.style.animation = '';
        }, 500);
        
        showNotification('Generating your meme! 🎨', 'info');
        
        setTimeout(() => {
            generateMeme();
        }, 800);
    });
    
    return card;
}

function createExampleCard(prompt, index) {
    // Examples: ONLY from EXAMPLES_MAP
    const imageUrl = EXAMPLES_MAP.get(prompt);
    if (!imageUrl) {
        console.warn(`Example "${prompt}" not found in EXAMPLES_MAP`);
        return null;
    }
    
    const card = document.createElement('div');
    card.className = 'example-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = prompt;
    img.loading = 'lazy';
    
    const promptText = document.createElement('p');
    promptText.textContent = `"${prompt}"`;
    promptText.style.fontStyle = 'italic';
    promptText.style.fontSize = '0.9rem';
    promptText.style.color = 'var(--color-primary)';
    promptText.style.textAlign = 'center';
    promptText.style.margin = '0.5rem 0';
    
    card.appendChild(img);
    card.appendChild(promptText);
    
    card.addEventListener('click', () => {
        userInput.value = prompt;
        userInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        userInput.focus();
        
        userInput.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            userInput.style.animation = '';
        }, 500);
        
        showNotification('Generating your meme! 🎨', 'info');
        
        setTimeout(() => {
            generateMeme();
        }, 800);
    });
    
    return card;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#05ffa1' : type === 'error' ? '#ff61d8' : '#ffcc00'};
        color: #000;
        border-radius: 10px;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function celebrate() {
    const emojis = ['🎉', '✨', '🌟', '💫', '🎊'];
    const colors = ['#ff61d8', '#05ffa1', '#ffcc00'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                left: ${Math.random() * 100}%;
                top: -50px;
                font-size: ${20 + Math.random() * 20}px;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: fall ${2 + Math.random() * 2}s ease-in forwards;
                z-index: 999;
                pointer-events: none;
            `;
            
            document.body.appendChild(emoji);
            
            setTimeout(() => {
                emoji.remove();
            }, 4000);
        }, i * 100);
    }
}

function addFloatingEmojis() {
    const emojis = ['🐱', '💭', '✨', '🌟', '😸', '🐾', '💜', '🎨'];
    const container = document.querySelector('.container');
    
    emojis.forEach((emoji, index) => {
        const floater = document.createElement('div');
        floater.textContent = emoji;
        floater.className = 'floating-emoji';
        floater.style.cssText = `
            position: absolute;
            font-size: 2rem;
            opacity: 0.1;
            animation: float ${10 + index * 2}s infinite ease-in-out;
            animation-delay: ${index * 2}s;
            pointer-events: none;
            z-index: -1;
        `;
        
        container.appendChild(floater);
    });
}

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s';
        showNotification('🌈 Secret mode activated! You found the easter egg! 🦄', 'success');
        celebrate();
        
        document.querySelectorAll('h1, h2, h3').forEach(el => {
            el.innerHTML = el.innerHTML.replace(/Cat/g, '😸Cat😸');
        });
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

const catFacts = [
    "Cats spend 70% of their lives sleeping 😴",
    "A group of cats is called a 'clowder' 🐱🐱🐱",
    "Cats have over 20 vocalizations 🎵",
    "The first cat in space was French 🚀",
    "Cats can rotate their ears 180 degrees 👂"
];

function loadRandomCatFact() {
    setTimeout(() => {
        const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];
        showNotification(`Did you know? ${randomFact}`, 'info');
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fall {
        to {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translate(0, 0) rotate(0deg);
        }
        25% {
            transform: translate(100px, -50px) rotate(90deg);
        }
        50% {
            transform: translate(-50px, -100px) rotate(180deg);
        }
        75% {
            transform: translate(-100px, -50px) rotate(270deg);
        }
    }
    
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    @keyframes catSlide {
        0% {
            left: -100px;
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            left: calc(100vw + 100px);
            transform: rotate(360deg);
        }
    }
    
    @keyframes catSlowWalk {
        0% {
            left: -100px;
            transform: rotate(0deg);
        }
        50% {
            transform: rotate(180deg);
        }
        100% {
            left: calc(100vw + 100px);
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);