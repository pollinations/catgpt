// CatGPT Meme Generator Script 🐱✨

// Constants
const POLLINATIONS_API = 'https://image.pollinations.ai/prompt';
const ORIGINAL_CATGPT_IMAGE = 'https://github.com/pollinations/catgpt/blob/main/images/original-catgpt.png?raw=true';
const CATGPT_STYLE = 'Hand-drawn CatGPT comic style: A lazy cat lounging on furniture, looking uninterested and sarcastic. The cat is answering a human\'s question with ironic wisdom. Black and white sketch style with speech bubbles. The cat treats humans as servants.';

// Example memes for the gallery
const EXAMPLES = [
    {
        prompt: "What's the weather today?",
        description: "Weather forecast from a lazy cat"
    },
    {
        prompt: "How do I fix this bug?",
        description: "Debugging advice from CatGPT"
    },
    {
        prompt: "What should I eat for dinner?",
        description: "Culinary wisdom from a feline chef"
    },
    {
        prompt: "What's the meaning of life?",
        description: "Deep philosophical cat thoughts"
    }
];

// DOM Elements
const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultSection = document.getElementById('resultSection');
const generatedMeme = document.getElementById('generatedMeme');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');
const examplesGrid = document.getElementById('examplesGrid');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadExamples();
    setupEventListeners();
    
    // Add some fun to the page
    addFloatingEmojis();
    
    // Show random cat fact on page load
    setTimeout(() => {
        const randomFact = catFacts[Math.floor(Math.random() * catFacts.length)];
        showNotification(`Did you know? ${randomFact}`, 'info');
    }, 3000);
});

// Set up event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateMeme);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            generateMeme();
        }
    });
    
    downloadBtn.addEventListener('click', downloadMeme);
    shareBtn.addEventListener('click', shareMeme);
}

// Generate meme function
async function generateMeme() {
    const userQuestion = userInput.value.trim();
    
    if (!userQuestion) {
        showNotification('Please enter a question for CatGPT! 😸', 'warning');
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    loadingIndicator.classList.remove('hidden');
    resultSection.classList.add('hidden');
    
    // Create the full prompt
    const fullPrompt = `${CATGPT_STYLE} The human asks: "${userQuestion}". The cat responds with sarcastic, lazy wisdom. Include speech bubbles with the question and answer.`;
    
    try {
        // Generate the image using gptimage model with the original cat image
        const imageUrl = `${POLLINATIONS_API}/${encodeURIComponent(fullPrompt)}?model=gptimage&token=catgpt&image=${encodeURIComponent(ORIGINAL_CATGPT_IMAGE)}&width=800&height=800&seed=${Date.now()}&nologo=true`;
        
        // Create a new image element to handle loading
        const img = new Image();
        img.onload = () => {
            generatedMeme.src = imageUrl;
            showResult();
        };
        img.onerror = () => {
            throw new Error('Failed to generate image');
        };
        img.src = imageUrl;
        
    } catch (error) {
        console.error('Error generating meme:', error);
        showNotification('Oops! CatGPT is taking a nap. Try again! 😴', 'error');
    } finally {
        generateBtn.disabled = false;
        loadingIndicator.classList.add('hidden');
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

// Share meme
async function shareMeme() {
    const shareData = {
        title: 'CatGPT Meme',
        text: 'Check out this hilarious CatGPT meme I created!',
        url: window.location.href
    };
    
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            showNotification('Thanks for sharing! 🙌', 'success');
        } else {
            // Fallback: copy link
            await navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard! 📋', 'success');
        }
    } catch (error) {
        console.error('Error sharing:', error);
        showNotification('Could not share. Try copying the link! 🔗', 'error');
    }
}

// Load example memes
function loadExamples() {
    EXAMPLES.forEach((example, index) => {
        const card = createExampleCard(example, index);
        examplesGrid.appendChild(card);
    });
}

// Create example card
function createExampleCard(example, index) {
    const card = document.createElement('div');
    card.className = 'example-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    // Generate dynamic image URL for each example
    const examplePrompt = `${CATGPT_STYLE} The human asks: "${example.prompt}". The cat responds with sarcastic, lazy wisdom.`;
    const imageUrl = `${POLLINATIONS_API}/${encodeURIComponent(examplePrompt)}?model=gptimage&token=catgpt&image=${encodeURIComponent(ORIGINAL_CATGPT_IMAGE)}&width=400&height=400&seed=${index * 1000}&nologo=true`;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = example.description;
    img.loading = 'lazy';
    
    const description = document.createElement('p');
    description.textContent = example.description;
    
    card.appendChild(img);
    card.appendChild(description);
    
    // Click to use this prompt
    card.addEventListener('click', () => {
        userInput.value = example.prompt;
        userInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        userInput.focus();
        
        // Add a little animation to the input
        userInput.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            userInput.style.animation = '';
        }, 500);
        
        showNotification('Prompt added! Click Generate to create your meme 🎨', 'info');
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
