# Styles Module Structure

This folder contains the modular CSS code for the CatGPT Meme Generator, organized by functionality for better maintainability and readability.

## File Organization

### Core Files

- **`main.css`** - Main entry point. Imports all other stylesheets in the correct order.

- **`variables.css`** - CSS custom properties and color definitions:
  - Color palette (primary, secondary, accent)
  - Gradient definitions
  - Font imports

- **`base.css`** - Base and global styles:
  - Reset/normalize styles
  - Body and container styles
  - Base link behavior

### Component Styles

- **`header.css`** - Header and introduction section:
  - Title and emoji styling
  - Tagline
  - Intro text and links

- **`generator.css`** - Generator section and inputs:
  - Generator section container
  - Textarea input styling

- **`upload.css`** - Image upload and preview:
  - File input styling
  - Thumbnail preview
  - Remove button

- **`buttons.css`** - Button styles:
  - Generate button
  - Action buttons (Download, Share)
  - Button interactions and states

- **`loading.css`** - Loading states:
  - Loading spinner
  - Hidden state utility

- **`results.css`** - Result section display:
  - Result container
  - Meme image display

- **`cards.css`** - Grid card layouts:
  - Example cards grid
  - User memes grid
  - Card hover effects

- **`sponsor.css`** - Sponsor section:
  - Sponsorship banner
  - Sponsor links

- **`footer.css`** - Footer styles:
  - Footer layout
  - Footer links

### Visual Effects

- **`animations.css`** - All keyframe animations:
  - gradient-shift - Title background animation
  - bounce - Emoji bouncing
  - spin - Loading spinner
  - pulse - Pulse effect
  - rotate - Button emoji rotation
  - slideIn/slideOut - Notification animations
  - fall - Celebration confetti
  - float - Floating background emojis
  - catSlide/catSlowWalk - Cat emoji animations
  - rainbow - Easter egg effect
  - fadeIn - Card entrance animation

### Responsive Design

- **`responsive.css`** - Media queries:
  - Tablet breakpoint (768px)
  - Mobile breakpoint (480px)
  - All responsive adjustments

## Import Order

The import order in `main.css` is crucial:

1. **Variables** - Defines all CSS custom properties
2. **Base** - Global styles and reset
3. **Components** - All UI component styles
4. **Animations** - Keyframe definitions
5. **Responsive** - Media queries (should be last)

## How to Add a New Component

1. Create a new file, e.g., `banner.css`
2. Write your component styles
3. Add `@import url('./banner.css');` to `main.css` in the appropriate section
4. Keep the import order logical (before responsive, after base/variables)

## Color Palette

All colors are defined as CSS variables in `variables.css`:

- `--color-primary`: #ff61d8 (Bright Pink)
- `--color-secondary`: #05ffa1 (Neon Green)
- `--color-accent`: #ffcc00 (Bright Yellow)
- `--color-text`: #1a1a1a (Near Black)
- `--color-bg`: #ffffff (White)
- `--color-light`: #f5f5f5 (Light Gray)

Three gradient presets are also available for quick use.

## Maintenance Benefits

✅ **Modularity** - Each component in its own file  
✅ **Maintainability** - Easy to locate and update styles  
✅ **Scalability** - Add new components without clutter  
✅ **Reusability** - Components can be previewed in isolation  
✅ **Organization** - Clear separation by responsibility  
✅ **Specificity Management** - Reduced CSS specificity issues  

## File Sizes

- `variables.css` - Variables and imports
- `base.css` - ~25 lines (reset styles)
- `header.css` - ~60 lines (header components)
- `generator.css` - ~35 lines (generator section)
- `upload.css` - ~70 lines (upload components)
- `buttons.css` - ~70 lines (button styles)
- `loading.css` - ~25 lines (loading states)
- `results.css` - ~35 lines (results display)
- `cards.css` - ~50 lines (card grids)
- `sponsor.css` - ~25 lines (sponsor section)
- `footer.css` - ~25 lines (footer)
- `animations.css` - ~120 lines (keyframes)
- `responsive.css` - ~100 lines (media queries)
- `main.css` - ~25 lines (imports)

Total: Much more readable than 550+ lines in a single file!

## Usage in HTML

Simply link to `main.css`:

```html
<link rel="stylesheet" href="styles/main.css">
```

All modular files are imported automatically.
