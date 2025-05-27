// CatAnimation Web Component - Shows animated cats during loading
export class CatAnimation extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cats = ['🐱', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'];
        this.animationInterval = null;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.stop();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative;
                    width: 100%;
                    height: 100px;
                    overflow: hidden;
                }

                .cat {
                    position: absolute;
                    font-size: var(--cat-size, 3rem);
                    animation: catSlide var(--animation-duration, 3s) linear;
                    pointer-events: none;
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
                        left: calc(100% + 100px);
                        transform: rotate(360deg);
                    }
                }
            </style>
            <div class="animation-container"></div>
        `;
    }

    start() {
        if (this.animationInterval) return;
        
        const container = this.shadowRoot.querySelector('.animation-container');
        
        this.animationInterval = setInterval(() => {
            const cat = document.createElement('span');
            cat.className = 'cat';
            cat.textContent = this.cats[Math.floor(Math.random() * this.cats.length)];
            
            const size = Math.random() * 2 + 2; // 2-4rem
            const duration = Math.random() * 2 + 2; // 2-4s
            const top = Math.random() * 80; // 0-80% from top
            
            cat.style.setProperty('--cat-size', `${size}rem`);
            cat.style.setProperty('--animation-duration', `${duration}s`);
            cat.style.top = `${top}%`;
            
            container.appendChild(cat);
            
            // Remove cat after animation
            setTimeout(() => {
                cat.remove();
            }, duration * 1000);
        }, 400);
    }

    stop() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            
            // Clear all cats
            const container = this.shadowRoot.querySelector('.animation-container');
            if (container) {
                container.innerHTML = '';
            }
        }
    }
}

// Register the component
export function registerCatAnimation() {
    customElements.define('x-cat-animation', CatAnimation);
}
