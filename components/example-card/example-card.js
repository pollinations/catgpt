// ExampleCard Web Component - Shows example prompts that can be clicked
export class ExampleCard extends HTMLElement {
    static get observedAttributes() {
        return ['prompt', 'index', 'user-generated'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListener('click', this.handleClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.shadowRoot) {
            this.render();
        }
    }

    render() {
        const prompt = this.getAttribute('prompt') || '';
        const index = this.getAttribute('index') || '0';
        const isUserGenerated = this.hasAttribute('user-generated');
        
        const POLLINATIONS_API = 'https://image.pollinations.ai/prompt';
        const ORIGINAL_CATGPT_IMAGE = 'https://raw.githubusercontent.com/pollinations/catgpt/refs/heads/main/images/original-catgpt.png';
        const imagePrompt = `A simple CatGPT webcomic showing the question "${prompt}" with a cat's dismissive response`;
        const imageUrl = `${POLLINATIONS_API}/${encodeURIComponent(imagePrompt)}?width=400&height=400&seed=${index}&model=gptimage&image=${encodeURIComponent(ORIGINAL_CATGPT_IMAGE)}`;

        this.shadowRoot.innerHTML = `
            <style>
                @import '../../styles/variables.css';
                
                :host {
                    display: block;
                }

                .example-card {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s;
                    cursor: pointer;
                    position: relative;
                }

                .example-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
                }

                .example-card img {
                    width: 100%;
                    height: auto;
                    display: block;
                    aspect-ratio: 1;
                    object-fit: cover;
                }

                .example-card p {
                    padding: 1rem;
                    font-size: 0.9rem;
                    text-align: center;
                    font-weight: 500;
                    margin: 0;
                }

                .user-badge {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: var(--gradient-2);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                }

                /* Skeleton loader */
                .skeleton {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }

                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .image-container {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1;
                    background: #f0f0f0;
                }

                .image-container.skeleton::after {
                    content: "🐱";
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    font-size: 3rem;
                    opacity: 0.3;
                }
            </style>
            <div class="example-card">
                ${isUserGenerated ? '<div class="user-badge">✨ Your Meme</div>' : ''}
                <div class="image-container skeleton">
                    <img 
                        src="${imageUrl}" 
                        alt="Example: ${prompt}"
                        loading="lazy"
                        onload="this.parentElement.classList.remove('skeleton')"
                        onerror="this.parentElement.classList.remove('skeleton')"
                    />
                </div>
                <p>${prompt}</p>
            </div>
        `;
    }

    handleClick() {
        const prompt = this.getAttribute('prompt');
        if (prompt) {
            this.dispatchEvent(new CustomEvent('example-clicked', {
                detail: { prompt },
                bubbles: true
            }));
        }
    }
}

// Register the component
export function registerExampleCard() {
    customElements.define('x-example-card', ExampleCard);
}
