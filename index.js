// Main JavaScript entry point - registers all Web Components
import { registerCatAnimation } from './components/cat-animation/cat-animation.js';
import { registerMemeGenerator } from './components/meme-generator/meme-generator.js';
import { registerExampleCard } from './components/example-card/example-card.js';
import { registerCountdownPopup } from './components/countdown-popup/countdown-popup.js';

// Register all components
function registerAllComponents() {
    registerCatAnimation();
    registerMemeGenerator();
    registerExampleCard();
    registerCountdownPopup();
}

// Register components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerAllComponents);
} else {
    registerAllComponents();
}

// Export for use in other modules if needed
export { registerAllComponents };
