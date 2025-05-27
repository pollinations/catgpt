// CatGPT Meme Generator Script 🐱✨

// Constants
const POLLINATIONS_API = 'https://image.pollinations.ai/prompt';
const ORIGINAL_CATGPT_IMAGE = 'https://raw.githubusercontent.com/pollinations/catgpt/refs/heads/main/images/original-catgpt.png';
const CATGPT_STYLE = 'Single-panel CatGPT webcomic on white background. Thick uneven black marker strokes, intentionally sketchy. Human with dot eyes, black bob hair, brick/burgundy sweater (#8b4035). White cat with black patches sitting upright, half-closed eyes. Hand-written wobbly text, "CATGPT" title in rounded rectangle. @missfitcomics signature. 95% black-and-white, no shading.';

// Utility functions for DRY principle
function createCatGPTPrompt(userQuestion) {
    return `${CATGPT_STYLE} Human asks: "${userQuestion}". Cat responds with minimal aloof answer. Example: "Nap through it."`;
}

function generateImageURL(prompt) {
    return `${POLLINATIONS_API}/${encodeURIComponent(prompt)}?model=gptimage&token=catgpt&image=${encodeURIComponent(ORIGINAL_CATGPT_IMAGE)}`;
}

// Example memes for the gallery
const EXAMPLES = [
    "What's the weather today?",
    "How do I fix this bug?", 
    "What should I eat for dinner?",
    "What's the meaning of life?",
    "How do I get motivated?",
    "Why is my code not working?"
];

// LocalStorage functions for user-generated memes
function saveGeneratedPrompt(prompt) {
    const saved = getSavedPrompts();
    // Add to beginning, remove duplicates, limit to 8 items
    const updated = [prompt, ...saved.filter(p => p !== prompt)].slice(0, 8);
    localStorage.setItem('catgpt-generated', JSON.stringify(updated));
}

function getSavedPrompts() {
    try {
        return JSON.parse(localStorage.getItem('catgpt-generated')) || [];
    } catch {
        return [];
    }
}

// URL parameter handling for shared prompts
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
        // Auto-generate the meme if prompt is in URL
        setTimeout(() => {
            generateMeme();
        }, 500);
    }
}

// DOM Elements
const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultSection = document.getElementById('resultSection');
const generatedMeme = document.getElementById('generatedMeme');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const examplesGrid = document.getElementById('examplesGrid');
const newMemeBtn = document.getElementById('newMemeBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadExamples();
    loadRandomCatFact();
    handleURLPrompt(); // Handle URL prompt if present
    
    // Add event listeners
    generateBtn.addEventListener('click', generateMeme);
    shareBtn.addEventListener('click', shareMeme);
    newMemeBtn.addEventListener('click', () => {
        userInput.value = '';
        userInput.focus();
        resultSection.classList.add('hidden');
        // Clear URL prompt when starting fresh
        setURLPrompt('');
    });
    
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateMeme();
        }
    });
    
    // Add some fun to the page
    addFloatingEmojis();
});

// Set up event listeners
function setupEventListeners() {
    downloadBtn.addEventListener('click', downloadMeme);
}

// Generate meme function
async function generateMeme() {
    const userQuestion = userInput.value.trim();
    
    if (!userQuestion) {
        showNotification('Please enter a question for CatGPT! 😸', 'warning');
        return;
    }
    
    // Show loading state with disabled button
    generateBtn.disabled = true;
    generateBtn.innerHTML = '🐾 Generating... (~30s)';
    generateBtn.style.opacity = '0.6';
    generateBtn.style.cursor = 'not-allowed';
    
    loadingIndicator.classList.remove('hidden');
    resultSection.classList.add('hidden');
    
    // Start fake Gen-Z progress
    startFakeProgress();
    
    // Create the full prompt using utility function
    const fullPrompt = createCatGPTPrompt(userQuestion);
    
    try {
        // Generate the image URL using utility function
        const imageUrl = generateImageURL(fullPrompt);
        
        // Create a new image element to handle loading
        const img = new Image();
        let imageLoadTimeout;
        
        img.onload = () => {
            clearTimeout(imageLoadTimeout);
            generatedMeme.src = imageUrl;
            showResult();
            resetButton();
            // Save this prompt to localStorage and refresh examples
            saveGeneratedPrompt(userQuestion);
            refreshExamples();
            // Update URL for sharing
            setURLPrompt(userQuestion);
        };
        
        img.onerror = () => {
            clearTimeout(imageLoadTimeout);
            resetButton();
            handleImageError();
        };
        
        // Set timeout for slow/failed loading (45 seconds)
        imageLoadTimeout = setTimeout(() => {
            resetButton();
            handleImageError('timeout');
        }, 45000);
        
        img.src = imageUrl;
        
    } catch (error) {
        console.error('Error generating meme:', error);
        resetButton();
        handleImageError('general');
    }
}

// Handle image loading errors with funny cat messages
function handleImageError(errorType = 'general') {
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
    
    // Add a retry suggestion after 30 seconds
    setTimeout(() => {
        if (generateBtn.disabled === false) { // Only show if user hasn't tried again
            showNotification('🐱 *meows softly* Ready for another try? The queue should be clearer meow!', 'info');
        }
    }, 30000);
}

// Reset button to original state
function resetButton() {
    generateBtn.disabled = false;
    generateBtn.innerHTML = 'Generate CatGPT Meme 🎨';
    generateBtn.style.opacity = '1';
    generateBtn.style.cursor = 'pointer';
    loadingIndicator.classList.add('hidden');
    stopFakeProgress();
}

// Fake Gen-Z progress messages
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
        "✨ Sprinkling some Gen-Z magic dust...",
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
    
    // Update progress every 2.5 seconds
    progressInterval = setInterval(() => {
        if (progressStep < progressMessages.length) {
            progressText.textContent = progressMessages[progressStep];
            progressStep++;
        } else {
            progressText.textContent = "🎨 Finalizing your masterpiece...";
        }
    }, 2500);
    
    // Start with first message immediately
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

// Show the result
function showResult() {
    resultSection.classList.remove('hidden');
    
    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Add celebration animation
    celebrate();
}

// Download meme
function downloadMeme() {
    const link = document.createElement('a');
    link.href = generatedMeme.src;
    link.download = `catgpt-meme-${Date.now()}.png`;
    link.click();
    
    showNotification('Meme downloaded! 🎉', 'success');
}

// Share meme with better error handling
let isSharing = false;

async function shareMeme() {
    // Prevent multiple simultaneous shares
    if (isSharing) {
        showNotification('Please wait, sharing in progress... 🔄', 'info');
        return;
    }
    
    // Check if we have a generated meme
    if (!generatedMeme.src || generatedMeme.src === '') {
        showNotification('Generate a meme first! 🎨', 'warning');
        return;
    }
    
    isSharing = true;
    const currentURL = window.location.href;
    
    const shareData = {
        title: 'CatGPT Meme Generator',
        text: `Check out this CatGPT meme: "${userInput.value}"`,
        url: currentURL
    };
    
    try {
        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            await navigator.share(shareData);
            showNotification('Thanks for sharing! 🙌', 'success');
        } else {
            // Fallback: copy link
            await navigator.clipboard.writeText(currentURL);
            showNotification('Link copied to clipboard! 📋', 'success');
        }
    } catch (error) {
        // Only show error if it's not a user cancellation
        if (error.name !== 'AbortError') {
            console.error('Error sharing:', error);
            try {
                // Try clipboard fallback
                await navigator.clipboard.writeText(currentURL);
                showNotification('Link copied to clipboard! 📋', 'success');
            } catch (clipboardError) {
                showNotification('Could not share. Try copying the link manually! 🔗', 'error');
            }
        }
    } finally {
        isSharing = false;
    }
}

// Load example memes
function loadExamples() {
    // Clear existing examples
    examplesGrid.innerHTML = '';
    
    // Get saved prompts and combine with default examples
    const savedPrompts = getSavedPrompts();
    const allPrompts = [...savedPrompts, ...EXAMPLES];
    
    allPrompts.forEach((prompt, index) => {
        const card = createExampleCard(prompt, index, index < savedPrompts.length);
        examplesGrid.appendChild(card);
    });
}

// Refresh examples (useful after generating new memes)
function refreshExamples() {
    loadExamples();
}

// Create example card
function createExampleCard(prompt, index, isUserGenerated = false) {
    const card = document.createElement('div');
    card.className = 'example-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Add special styling for user-generated prompts
    if (isUserGenerated) {
        card.style.border = '2px solid var(--color-accent)';
        card.style.boxShadow = '0 0 10px rgba(255, 105, 180, 0.3)';
    }
    
    // Generate dynamic image URL using utility functions
    const examplePrompt = createCatGPTPrompt(prompt);
    const imageUrl = generateImageURL(examplePrompt);
    
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
    
    // Add "Your Meme" badge for user-generated content
    if (isUserGenerated) {
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
        card.appendChild(badge);
    }
    
    card.appendChild(img);
    card.appendChild(promptText);
    
    // Click to use this prompt
    card.addEventListener('click', () => {
        userInput.value = prompt;
        userInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        userInput.focus();
        
        // Add a little animation to the input
        userInput.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            userInput.style.animation = '';
        }, 500);
        
        showNotification('Generating your meme! 🎨', 'info');
        
        // Auto-generate the meme after a short delay
        setTimeout(() => {
            generateMeme();
        }, 800);
    });
    
    return card;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styles for notification
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

// Celebration animation
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

// Add floating emojis for fun
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

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s';
        showNotification('🌈 Secret mode activated! You found the easter egg! 🦄', 'success');
        celebrate();
        
        // Add special cat mode
        document.querySelectorAll('h1, h2, h3').forEach(el => {
            el.innerHTML = el.innerHTML.replace(/Cat/g, '😸Cat😸');
        });
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add random cat facts
const catFacts = [
    "Cats spend 70% of their lives sleeping 😴",
    "A group of cats is called a 'clowder' 🐱🐱🐱",
    "Cats have over 20 vocalizations 🎵",
    "The first cat in space was French 🚀",
    "Cats can rotate their ears 180 degrees 👂"
];

// Load random cat fact
function loadRandomCatFact() {
    setTimeout(() => {
        const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];
        showNotification(`Did you know? ${randomFact}`, 'info');
    }, 3000);
}

// Add CSS animations
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
`;
document.head.appendChild(style);

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
