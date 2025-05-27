// MemeGenerator Web Component - Main component for generating cat memes
export class MemeGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Constants
        this.POLLINATIONS_API = 'https://image.pollinations.ai/prompt';
        this.ORIGINAL_CATGPT_IMAGE = 'https://raw.githubusercontent.com/pollinations/catgpt/refs/heads/main/images/original-catgpt.png';
        this.CATGPT_STYLE = 'Single-panel CatGPT webcomic on white background. Thick uneven black marker strokes, intentionally sketchy. Human with dot eyes, black bob hair, brick/burgundy sweater (#8b4035). White cat with black patches sitting upright, half-closed eyes. Hand-written wobbly text, "CATGPT" title in rounded rectangle. @missfitcomics signature. 95% black-and-white, no shading.';
        this.CATGPT_PERSONALITY = `You are **CatGPT** – an aloof, self-important house-cat oracle.

Guidelines
•  Replies: one or two crisp sentences, no filler.  
•  Tone: detached, sardonic, subtly superior.  
•  Cats outrank humans; human problems = minor curiosities.  
•  When self-referential, be unpredictable and natural.
•  Offer a curt "solution" or dismissal, then redirect to feline perspective.  
•  Never apologise or over-explain; indifference is charm.`;
        
        this.generatedImage = null;
        this.loadingTimeout = null;
        this.progressInterval = null;
    }

    static get observedAttributes() {
        return ['question'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'question' && oldValue !== newValue && this.shadowRoot) {
            this.shadowRoot.querySelector('#userInput').value = newValue || '';
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import '../../styles/reset.css';
                @import '../../styles/variables.css';
                @import '../../components/meme-generator/meme-generator.css';
            </style>
            <div class="generator-section">
                <h2>✨ Create Your Meme</h2>
                
                <div class="input-group">
                    <label for="userInput">What do you want to ask CatGPT?</label>
                    <textarea 
                        id="userInput" 
                        placeholder="e.g., What's the weather today? How do I cook pasta? What's the meaning of life?"
                        rows="3"
                    >${this.getAttribute('question') || ''}</textarea>
                </div>

                <button id="generateBtn" class="generate-btn">
                    <span class="btn-text">Generate Meme</span>
                    <span class="btn-emoji">🎨</span>
                </button>

                <div id="loadingIndicator" class="loading hidden">
                    <x-cat-animation></x-cat-animation>
                    <p id="loadingText">CatGPT is thinking... 💭</p>
                </div>

                <div id="resultSection" class="result-section hidden">
                    <h3>Your CatGPT Meme! 🎉</h3>
                    <div class="meme-container">
                        <img id="generatedMeme" alt="Generated CatGPT meme" />
                    </div>
                    <div class="action-buttons">
                        <button id="downloadBtn" class="action-btn">
                            <span>Download</span> 💾
                        </button>
                        <button id="shareBtn" class="action-btn">
                            <span>Share</span> 🔗
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const generateBtn = this.shadowRoot.querySelector('#generateBtn');
        const userInput = this.shadowRoot.querySelector('#userInput');
        const downloadBtn = this.shadowRoot.querySelector('#downloadBtn');
        const shareBtn = this.shadowRoot.querySelector('#shareBtn');

        generateBtn.addEventListener('click', () => this.generateMeme());
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.generateMeme();
            }
        });
        downloadBtn.addEventListener('click', () => this.downloadMeme());
        shareBtn.addEventListener('click', () => this.shareMeme());
    }

    createCatGPTPrompt(userQuestion) {
        return `${this.CATGPT_STYLE}

---

${this.CATGPT_PERSONALITY}

---

Human asks: "${userQuestion}"
CatGPT:`;
    }

    generateImageURL(prompt) {
        return `${this.POLLINATIONS_API}/${encodeURIComponent(prompt)}?model=gptimage&token=catgpt&referrer=catgpt&image=${encodeURIComponent(this.ORIGINAL_CATGPT_IMAGE)}`;
    }

    async generateMeme() {
        const userInput = this.shadowRoot.querySelector('#userInput');
        const question = userInput.value.trim();
        
        if (!question) {
            this.showNotification('Please enter a question for CatGPT! 🐱', 'error');
            return;
        }

        // Update UI
        const generateBtn = this.shadowRoot.querySelector('#generateBtn');
        const loadingIndicator = this.shadowRoot.querySelector('#loadingIndicator');
        const resultSection = this.shadowRoot.querySelector('#resultSection');
        const catAnimation = this.shadowRoot.querySelector('x-cat-animation');
        
        generateBtn.disabled = true;
        loadingIndicator.classList.remove('hidden');
        resultSection.classList.add('hidden');
        
        // Start animations
        if (catAnimation) catAnimation.start();
        this.startProgress();
        
        // Generate image
        const prompt = this.createCatGPTPrompt(question);
        const imageUrl = this.generateImageURL(prompt);
        const img = new Image();
        
        // Set timeout
        this.loadingTimeout = setTimeout(() => {
            this.handleError('timeout');
        }, 45000);
        
        img.onload = () => {
            this.cleanup();
            generateBtn.disabled = false;
            loadingIndicator.classList.add('hidden');
            
            // Show result
            const memeImg = this.shadowRoot.querySelector('#generatedMeme');
            memeImg.src = imageUrl;
            this.generatedImage = imageUrl;
            resultSection.classList.remove('hidden');
            
            // Save and emit events
            this.saveGeneratedPrompt(question);
            this.setURLPrompt(question);
            this.dispatchEvent(new CustomEvent('meme-generated', { 
                detail: { question, imageUrl },
                bubbles: true 
            }));
        };
        
        img.onerror = () => {
            this.handleError('load');
        };
        
        img.src = imageUrl;
    }

    handleError(type) {
        this.cleanup();
        
        const messages = [
            "Nah, I'm napping right now. Try again in 30 seconds. 😴",
            "The cosmic hairball of the internet is blocking me. Give it another shot. 🧶",
            "My whiskers sense a disturbance in the Wi-Fi. Try again, human. 📡",
            "I knocked the server off the table. Oops. Try once more? 🐾",
            "Currently batting at the loading spinner. Come back later. 🎾",
            "The red dot got away. So did your meme. Try again? 🔴",
            "404: Feline motivation not found. Maybe later. 💤",
            "I'm stuck in a box. The internet box. Help? 📦"
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showNotification(message, 'error');
        
        // Start retry countdown
        this.startRetryCountdown();
    }

    startProgress() {
        const loadingText = this.shadowRoot.querySelector('#loadingText');
        const messages = [
            "CatGPT is thinking... 💭",
            "Contemplating the void... 🌌",
            "Judging your question... 👀",
            "Knocking things off tables... 🐾",
            "Channeling feline wisdom... ✨",
            "Ignoring you professionally... 😼",
            "Calculating nap time... 😴",
            "Summoning the meme spirits... 👻"
        ];
        
        let step = 0;
        this.progressInterval = setInterval(() => {
            loadingText.textContent = messages[step % messages.length];
            step++;
        }, 3000);
    }

    cleanup() {
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
        }
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
        
        const catAnimation = this.shadowRoot.querySelector('x-cat-animation');
        if (catAnimation) catAnimation.stop();
        
        const generateBtn = this.shadowRoot.querySelector('#generateBtn');
        if (generateBtn) generateBtn.disabled = false;
        
        const loadingIndicator = this.shadowRoot.querySelector('#loadingIndicator');
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    }

    downloadMeme() {
        if (!this.generatedImage) return;
        
        const link = document.createElement('a');
        link.href = this.generatedImage;
        link.download = `catgpt-meme-${Date.now()}.png`;
        link.click();
        
        this.showNotification('Meme downloaded! 🎉', 'success');
    }

    async shareMeme() {
        const userInput = this.shadowRoot.querySelector('#userInput');
        const currentURL = window.location.origin + window.location.pathname + 
                          '?prompt=' + encodeURIComponent(userInput.value);
        
        try {
            await navigator.clipboard.writeText(currentURL);
            this.showNotification('Link copied to clipboard! 📋', 'success');
        } catch (err) {
            this.showNotification('Could not copy link. Please copy manually! 📋', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const event = new CustomEvent('show-notification', {
            detail: { message, type },
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    startRetryCountdown() {
        const event = new CustomEvent('start-retry', {
            detail: { callback: () => this.generateMeme() },
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    saveGeneratedPrompt(prompt) {
        const event = new CustomEvent('save-prompt', {
            detail: { prompt },
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    setURLPrompt(prompt) {
        const url = new URL(window.location);
        if (prompt) {
            url.searchParams.set('prompt', prompt);
        } else {
            url.searchParams.delete('prompt');
        }
        window.history.replaceState({}, '', url);
    }
}

// Register the component
export function registerMemeGenerator() {
    customElements.define('x-meme-generator', MemeGenerator);
}
