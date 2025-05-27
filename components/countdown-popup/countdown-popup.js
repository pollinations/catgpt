// CountdownPopup Web Component - Shows a Gen-Z style countdown for retry
export class CountdownPopup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.countdownInterval = null;
        this.countdown = 30;
        this.callback = null;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                @import '../../styles/variables.css';
                
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(10px);
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .countdown-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    padding: 2rem;
                    max-width: 400px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    position: relative;
                    overflow: hidden;
                    animation: slideUp 0.4s ease-out;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .countdown-card::before {
                    content: "";
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: var(--gradient-3);
                    opacity: 0.1;
                    animation: rotate 10s linear infinite;
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .countdown-content {
                    position: relative;
                    z-index: 1;
                }

                .countdown-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    background: var(--gradient-1);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .countdown-message {
                    font-size: 1.1rem;
                    margin-bottom: 1.5rem;
                    color: var(--color-text);
                }

                .countdown-number {
                    font-size: 4rem;
                    font-weight: 900;
                    background: var(--gradient-2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: pulse 1s ease-in-out infinite;
                    display: block;
                    margin-bottom: 1.5rem;
                }

                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                }

                .cancel-btn {
                    padding: 0.8rem 1.5rem;
                    font-size: 1rem;
                    font-weight: 600;
                    color: white;
                    background: var(--gradient-1);
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .cancel-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(255, 97, 216, 0.3);
                }

                .decorative-emoji {
                    position: absolute;
                    font-size: 2rem;
                    opacity: 0.5;
                    animation: float 3s ease-in-out infinite;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }

                .emoji-1 {
                    top: 1rem;
                    left: 1rem;
                    animation-delay: 0s;
                }

                .emoji-2 {
                    top: 1rem;
                    right: 1rem;
                    animation-delay: 0.5s;
                }

                .emoji-3 {
                    bottom: 1rem;
                    left: 1rem;
                    animation-delay: 1s;
                }

                .emoji-4 {
                    bottom: 1rem;
                    right: 1rem;
                    animation-delay: 1.5s;
                }
            </style>
            <div class="countdown-card">
                <span class="decorative-emoji emoji-1">✨</span>
                <span class="decorative-emoji emoji-2">🔥</span>
                <span class="decorative-emoji emoji-3">💯</span>
                <span class="decorative-emoji emoji-4">🚀</span>
                
                <div class="countdown-content">
                    <h3 class="countdown-title">Hold up fam! 🤚</h3>
                    <p class="countdown-message">No cap, we'll try again automatically! 💯</p>
                    <span class="countdown-number">${this.countdown}</span>
                    <button class="cancel-btn">Nah, I'm good</button>
                </div>
            </div>
        `;

        // Add cancel button listener
        this.shadowRoot.querySelector('.cancel-btn').addEventListener('click', () => {
            this.cleanup();
            this.remove();
        });
    }

    start(callback) {
        this.callback = callback;
        this.countdown = 30;
        
        this.countdownInterval = setInterval(() => {
            this.countdown--;
            const numberElement = this.shadowRoot.querySelector('.countdown-number');
            if (numberElement) {
                numberElement.textContent = this.countdown;
            }
            
            if (this.countdown <= 0) {
                this.cleanup();
                if (this.callback) {
                    this.callback();
                }
                this.remove();
            }
        }, 1000);
    }

    cleanup() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
}

// Register the component
export function registerCountdownPopup() {
    customElements.define('x-countdown-popup', CountdownPopup);
}
