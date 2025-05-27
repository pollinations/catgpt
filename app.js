// Main application logic for CatGPT
const EXAMPLES = [
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
];

// Cat facts for fun notifications
const CAT_FACTS = [
    "Cats spend 70% of their lives sleeping 😴",
    "A group of cats is called a 'clowder' 🐱🐱🐱",
    "Cats have over 20 vocalizations 🎵",
    "The first cat in space was French 🚀",
    "Cats can rotate their ears 180 degrees 👂"
];

// LocalStorage functions
function getSavedPrompts() {
    try {
        return JSON.parse(localStorage.getItem('catgpt-generated')) || [];
    } catch {
        return [];
    }
}

function saveGeneratedPrompt(prompt) {
    const saved = getSavedPrompts();
    const updated = [prompt, ...saved.filter(p => p !== prompt)].slice(0, 8);
    localStorage.setItem('catgpt-generated', JSON.stringify(updated));
}

// URL parameter handling
function getURLPrompt() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('prompt');
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const memeGenerator = document.getElementById('memeGenerator');
    const examplesGrid = document.getElementById('examplesGrid');
    
    // Load examples
    loadExamples();
    
    // Handle URL prompt
    const urlPrompt = getURLPrompt();
    if (urlPrompt) {
        memeGenerator.setAttribute('question', urlPrompt);
        // Auto-generate after a short delay
        setTimeout(() => {
            memeGenerator.shadowRoot.querySelector('#generateBtn').click();
        }, 800);
    }
    
    // Listen for events from components
    document.addEventListener('meme-generated', (e) => {
        const { question } = e.detail;
        celebrate();
        refreshExamples();
    });
    
    document.addEventListener('save-prompt', (e) => {
        const { prompt } = e.detail;
        saveGeneratedPrompt(prompt);
    });
    
    document.addEventListener('show-notification', (e) => {
        const { message, type } = e.detail;
        showNotification(message, type);
    });
    
    document.addEventListener('start-retry', (e) => {
        const { callback } = e.detail;
        showRetryCountdown(callback);
    });
    
    document.addEventListener('example-clicked', (e) => {
        const { prompt } = e.detail;
        memeGenerator.setAttribute('question', prompt);
        // Auto-generate after a short delay
        setTimeout(() => {
            memeGenerator.shadowRoot.querySelector('#generateBtn').click();
        }, 800);
    });
    
    // Show random cat fact after delay
    setTimeout(() => {
        const randomFact = CAT_FACTS[Math.floor(Math.random() * CAT_FACTS.length)];
        showNotification(`Did you know? ${randomFact}`, 'info');
    }, 3000);
    
    // Add floating emojis
    addFloatingEmojis();
    
    // Easter egg: Konami code
    setupKonamiCode();
});

// Load examples into the grid
function loadExamples() {
    const examplesGrid = document.getElementById('examplesGrid');
    examplesGrid.innerHTML = '';
    
    // Get saved prompts
    const savedPrompts = getSavedPrompts();
    
    // Add saved prompts first
    savedPrompts.forEach((prompt, index) => {
        const card = document.createElement('x-example-card');
        card.setAttribute('prompt', prompt);
        card.setAttribute('index', `saved-${index}`);
        card.setAttribute('user-generated', '');
        examplesGrid.appendChild(card);
    });
    
    // Add default examples (limit to fill grid)
    const remainingSlots = Math.max(0, 12 - savedPrompts.length);
    const shuffled = [...EXAMPLES].sort(() => Math.random() - 0.5);
    const selectedExamples = shuffled.slice(0, remainingSlots);
    
    selectedExamples.forEach((prompt, index) => {
        const card = document.createElement('x-example-card');
        card.setAttribute('prompt', prompt);
        card.setAttribute('index', index.toString());
        examplesGrid.appendChild(card);
    });
}

// Refresh examples
function refreshExamples() {
    setTimeout(loadExamples, 100);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Show retry countdown
function showRetryCountdown(callback) {
    const countdown = document.createElement('x-countdown-popup');
    document.body.appendChild(countdown);
    countdown.start(callback);
}

// Celebration animation
function celebrate() {
    const emojis = ['🎉', '🎊', '✨', '🌟', '💫'];
    const colors = ['#ff61d8', '#05ffa1', '#ffcc00', '#00d4ff'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const emoji = document.createElement('div');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: fixed;
                font-size: 2rem;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * window.innerWidth}px;
                top: -50px;
                z-index: 9999;
                pointer-events: none;
                animation: fall 3s ease-in forwards;
            `;
            
            document.body.appendChild(emoji);
            setTimeout(() => emoji.remove(), 3000);
        }, i * 100);
    }
}

// Add floating emojis
function addFloatingEmojis() {
    const emojis = ['🐱', '😺', '😸', '😹', '😻'];
    const container = document.querySelector('.container');
    
    emojis.forEach((emoji, index) => {
        const floater = document.createElement('div');
        floater.textContent = emoji;
        floater.className = 'floating-emoji';
        floater.style.cssText = `
            animation: float ${10 + index * 2}s infinite ease-in-out;
            animation-delay: ${index * 2}s;
        `;
        
        container.appendChild(floater);
    });
}

// Setup Konami code easter egg
function setupKonamiCode() {
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                           'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
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
}

// Add necessary CSS animations
const style = document.createElement('style');
style.textContent = `
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
    
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
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
`;
document.head.appendChild(style);
