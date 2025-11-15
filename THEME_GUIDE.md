# Sage Garden Theme Guide

## Overview

Your Expense Tracker now uses the **Sage Garden** design system with full dark/light mode support. The theme features a calming, nature-inspired color palette with excellent contrast and readability.

## Theme Features

### Color Palette

**Light Mode:**
- Background: Soft off-white with a slight warm tint
- Primary: Sage green (`oklch(0.6333 0.0309 154.9039)`)
- Secondary: Light mint green
- Accent: Soft teal
- Text: Deep charcoal with purple undertones

**Dark Mode:**
- Background: Deep charcoal black
- Primary: Sage green (same as light mode for consistency)
- Secondary: Dark gray
- Accent: Muted teal
- Text: Off-white

### Typography

The Sage Garden theme uses custom font stacks:
- **Sans-serif**: Antic (fallback to system fonts)
- **Monospace**: JetBrains Mono
- **Serif**: Signifier

These are defined as CSS variables and will fallback gracefully to system fonts if the custom fonts aren't loaded.

### Border Radius

- Default radius: `0.35rem` (more subtle than standard designs)
- Provides a softer, more organic feel

### Letter Spacing

The theme includes custom letter-spacing variables:
- `--tracking-normal`: 0em (baseline)
- `--tracking-tight`: -0.025em
- `--tracking-wide`: +0.025em
- And more variations for fine-tuned typography

## Theme Switching

### How to Switch Themes

Click the sun/moon icon in the navigation bar to access the theme menu:
- **Light**: Force light mode
- **Dark**: Force dark mode
- **System**: Follow system preferences (default)

### Persistence

Your theme preference is saved to LocalStorage under the key `expense-tracker-theme` and persists across sessions.

## Components Updated

### New Components

1. **ThemeProvider** (`components/ThemeProvider.tsx`)
   - Manages theme state
   - Handles LocalStorage persistence
   - Applies theme classes to the document root
   - Supports system preference detection

2. **ThemeToggle** (`components/ThemeToggle.tsx`)
   - Dropdown menu for theme selection
   - Animated sun/moon icons
   - Located in the navbar

### Updated Components

1. **Navbar** - Added ThemeToggle button
2. **Layout** - Wrapped in ThemeProvider
3. **globals.css** - Complete Sage Garden color system

## Color Variables

### Light Mode Colors

```css
--background: oklch(0.9761 0.0041 91.4461);
--foreground: oklch(0.2417 0.0298 269.8827);
--primary: oklch(0.6333 0.0309 154.9039);
--secondary: oklch(0.8596 0.0291 119.9919);
--accent: oklch(0.8242 0.0221 136.6092);
--destructive: oklch(0.5624 0.1743 26.1433);
```

### Dark Mode Colors

```css
--background: oklch(0.1448 0 0);
--foreground: oklch(0.9702 0 0);
--primary: oklch(0.6333 0.0309 154.9039);
--secondary: oklch(0.2178 0 0);
--accent: oklch(0.3709 0.0248 153.9823);
--destructive: oklch(0.6368 0.2078 25.3313);
```

## Chart Colors

The theme provides 5 chart colors that work well in both light and dark modes:

1. **chart-1**: Sage green (primary color)
2. **chart-2**: Light yellow-green
3. **chart-3**: Soft teal
4. **chart-4**: Muted purple-blue
5. **chart-5**: Varies by theme

These colors are automatically used in your Recharts components.

## Using Theme in Custom Components

### Access Theme State

```tsx
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Theme-Aware Styling

All shadcn/ui components automatically adapt to the theme. For custom components, use the CSS variables:

```css
.my-element {
  background-color: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
}
```

Or use Tailwind classes that reference the theme:

```tsx
<div className="bg-background text-foreground border border-border">
  Content
</div>
```

## Benefits of Sage Garden Theme

1. **Calming Aesthetic**: Nature-inspired colors reduce eye strain
2. **Excellent Contrast**: WCAG compliant color combinations
3. **Consistent Primary**: Same sage green in both themes
4. **Professional**: Subtle, sophisticated design
5. **Modern**: Uses OKLCH color space for perceptual uniformity
6. **Accessible**: High contrast ratios for readability

## Customization

To customize the theme colors, edit `app/globals.css`:

1. Find the `:root` section for light mode
2. Find the `.dark` section for dark mode
3. Modify the CSS variable values
4. Colors use OKLCH format: `oklch(lightness chroma hue)`

Example:
```css
--primary: oklch(0.6333 0.0309 154.9039);
           /* ^      ^      ^
              |      |      |
              |      |      +-- Hue (0-360)
              |      +--------- Chroma (color intensity)
              +---------------- Lightness (0-1)
           */
```

## Testing Both Themes

To ensure your components work well in both themes:

1. Click the theme toggle in the navbar
2. Switch between Light, Dark, and System
3. Test all pages (Home, Analytics, Settings)
4. Check that charts, cards, and forms are readable
5. Verify buttons and interactive elements have good contrast

## Browser Compatibility

The theme system works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

OKLCH colors have excellent browser support and fallback gracefully.

---

Enjoy your beautiful Sage Garden themed Expense Tracker! 🌿

