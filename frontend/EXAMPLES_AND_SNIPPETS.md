# 🎨 UI Examples & Code Snippets

## Quick Visual Guide

### Dark Mode Toggle
Located in the **top-right corner** of the navbar
- **Light mode**: Sun icon ☀️
- **Dark mode**: Moon icon 🌙
- Preference saved automatically

---

## Component Usage Examples

### 1. PremiumAvatar
Used for displaying user profile pictures with online status

```jsx
import PremiumAvatar from '../components/premium/PremiumAvatar';

<PremiumAvatar
  src={user.profilePic}
  alt={user.fullName}
  size="lg"           // sm, md, lg, xl, 2xl
  showStatus={true}
  isOnline={true}
/>
```

**What it does:**
- Displays circular avatar with gradient fallback
- Shows green online indicator
- Smooth hover ring effect
- Mobile responsive sizes

---

### 2. PremiumCard
Reusable container with glassmorphism effect

```jsx
import PremiumCard from '../components/premium/PremiumCard';

<PremiumCard 
  hoverable={true}
  animated={true}
  gradient={false}
>
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</PremiumCard>
```

**Features:**
- Frosted glass appearance
- Smooth hover animations
- Optional gradients
- Responsive shadows

---

### 3. PremiumBadge
Modern badge component for tags

```jsx
import PremiumBadge from '../components/premium/PremiumBadge';

<PremiumBadge variant="primary" size="md">
  🇬🇧 English
</PremiumBadge>

// Variants: primary, secondary, accent, success
// Sizes: sm, md, lg
```

**Variants:**
- **primary**: Blue gradient
- **secondary**: Green gradient  
- **accent**: Pink gradient
- **success**: Emerald gradient

---

### 4. PremiumMessageBubble
Chat message styling with reactions

```jsx
import PremiumMessageBubble from '../components/premium/PremiumMessageBubble';

<PremiumMessageBubble
  message="Hello! How are you?"
  isOwn={true}
  showTime={true}
  isRead={true}
  isDelivered={true}
  reactions={['👍', '❤️']}
/>
```

**Features:**
- Message bubbles (sent/received)
- Delivery and read status
- Emoji reactions
- Timestamp display

---

### 5. TypingIndicator
Animated typing dots

```jsx
import TypingIndicator from '../components/premium/TypingIndicator';

<TypingIndicator />
```

**Shows:**
- "Typing" text
- 3 bouncing dots
- Smooth animation loop

---

### 6. PremiumChatInput
Advanced input with emoji and attachments

```jsx
import PremiumChatInput from '../components/premium/PremiumChatInput';

<PremiumChatInput
  onSendMessage={(message) => {
    console.log('Sending:', message);
  }}
  onEmojiSelect={(emoji) => {
    console.log('Selected emoji:', emoji);
  }}
  onAttachmentUpload={(files) => {
    console.log('Files to upload:', files);
  }}
  disabled={false}
  placeholder="Type a message..."
/>
```

**Features:**
- Text input with auto-grow
- Emoji picker (10 common emojis)
- File attachment preview
- Voice message button
- Send button

---

## Theme Usage Examples

### Dark Mode in Components

```jsx
import { useThemeStore } from '../store/useThemeStore';

export default function MyComponent() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  
  return (
    <div>
      <p>Current mode: {isDarkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
}
```

### Dark Mode Classes

```jsx
// Light mode: default classes
// Dark mode: add 'dark:' prefix

<div className="bg-white dark:bg-slate-900">
  {/* White in light mode, slate-900 in dark mode */}
</div>

<p className="text-gray-900 dark:text-white">
  {/* Black text in light, white in dark */}
</p>

<button className="bg-blue-500 dark:bg-blue-600">
  {/* Slightly different shade in dark mode */}
</button>
```

---

## Animation Examples

### Simple Fade Animation

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content fades in
</motion.div>
```

### Hover Effects

```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Staggered List

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## Custom Tailwind Classes

These utility classes are available in `src/index.css`:

```css
/* Glassmorphism Effect */
.glass {
  @apply backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 
    border border-white/20 dark:border-white/10;
}

/* Premium Button */
.btn-premium {
  @apply px-6 py-3 rounded-xl font-semibold transition-all 
    duration-300 hover:shadow-lg;
}

/* Premium Input */
.input-premium {
  @apply w-full px-4 py-3 rounded-xl border border-gray-200 
    dark:border-slate-700 bg-gray-50 dark:bg-slate-800 
    focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-transparent dark:text-white transition-all 
    duration-300;
}

/* Gradient Text */
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r;
}
```

---

## Common Patterns

### Responsive Layout

```jsx
<div className="
  grid 
  grid-cols-1        // 1 column on mobile
  sm:grid-cols-2     // 2 columns on tablets
  lg:grid-cols-3     // 3 columns on desktop
  gap-4              // 1rem gap
">
  {items.map(item => <div key={item.id}>{item}</div>)}
</div>
```

### Responsive Text

```jsx
<h1 className="
  text-2xl      // 24px on mobile
  sm:text-3xl   // 30px on tablet
  lg:text-4xl   // 36px on desktop
  font-bold
">
  Responsive Heading
</h1>
```

### Responsive Padding

```jsx
<div className="
  p-4        // 1rem padding on mobile
  sm:p-6     // 1.5rem on tablet
  lg:p-8     // 2rem on desktop
">
  Content with responsive padding
</div>
```

---

## Color Palette

### Light Mode Colors
```
White:       #FFFFFF
Gray:        #FAFAFA (bg), #F3F4F6 (borders)
Text:        #111827 (dark), #6B7280 (muted)
Primary:     #3B82F6 (blue)
Secondary:   #A855F7 (purple)
Success:     #10B981 (green)
Error:       #EF4444 (red)
```

### Dark Mode Colors
```
Background:  #0F172A (slate-900)
Secondary:   #1E293B (slate-800)
Tertiary:    #334155 (slate-700)
Text:        #FFFFFF (white)
Muted:       #94A3B8 (slate-400)
Primary:     #60A5FA (blue)
Secondary:   #D8B4FE (purple)
Success:     #6EE7B7 (green)
```

---

## Spacing Scale

Used consistently across the app:

```
p-1 = 0.25rem (4px)
p-2 = 0.5rem  (8px)
p-3 = 0.75rem (12px)
p-4 = 1rem    (16px)
p-6 = 1.5rem  (24px)
p-8 = 2rem    (32px)
p-12 = 3rem   (48px)
```

---

## Typography

### Font Stack
```jsx
// System font for all text
font-family: 'Inter', 'Segoe UI', 'Roboto', sans-serif;

// Optional Poppins for headings
font-family: 'Poppins', sans-serif;
```

### Font Sizes
```
text-xs   = 12px
text-sm   = 14px
text-base = 16px
text-lg   = 18px
text-xl   = 20px
text-2xl  = 24px
text-3xl  = 30px
text-4xl  = 36px
```

### Font Weights
```
font-normal   = 400
font-medium   = 500
font-semibold = 600
font-bold     = 700
```

---

## Rounded Corners

Used for modern look:

```
rounded-lg  = 8px
rounded-xl  = 12px
rounded-2xl = 16px
rounded-3xl = 24px
```

---

## Shadows

Progressive shadow hierarchy:

```
shadow-sm   = subtle
shadow-md   = medium
shadow-lg   = prominent
shadow-xl   = dramatic
shadow-2xl  = maximum (on hover)
```

---

## Motion Easing

Common animation easing:

```jsx
transition={{ 
  duration: 0.3,
  ease: "easeInOut"  // smooth animation
}}
```

---

## Icon Usage

Using Lucide React icons:

```jsx
import { Moon, Sun, Menu, X, Send, Smile } from 'lucide-react';

<Moon className="w-5 h-5" />
<Sun className="w-5 h-5" />
<Send className="w-4 h-4" />
```

---

## Accessibility

### Focus States
```jsx
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-blue-500 
  focus:ring-offset-2
  dark:focus:ring-offset-slate-900
">
  Click me
</button>
```

### Keyboard Navigation
- Tab: Move focus
- Shift+Tab: Previous focus
- Enter/Space: Activate buttons

### Color Contrast
- Light mode: #111827 text on #FFFFFF
- Dark mode: #FFFFFF text on #0F172A
- Both meet WCAG AAA standards

---

## Best Practices

### When Using PremiumCard
```jsx
✅ DO:
<PremiumCard hoverable animated>
  <p>Nice content</p>
</PremiumCard>

❌ DON'T:
<div className="rounded-xl border...">
  <p>Using manual styles</p>
</div>
```

### When Using Dark Mode
```jsx
✅ DO:
<div className="bg-white dark:bg-slate-900">

❌ DON'T:
<div className="bg-base-100">  // Old DaisyUI
```

### When Animating
```jsx
✅ DO:
<motion.div whileHover={{ scale: 1.05 }}>
  Smooth animation

❌ DON'T:
<div style={{ transition: 'all 0.3s' }}>
  Jerky animation
```

---

## Performance Tips

1. **Lazy animate**: Only animate on user interaction
2. **Use CSS**: For simple hover/focus effects
3. **Optimize**: Reduce number of animated elements
4. **Test**: Check DevTools Performance tab
5. **Reduce motion**: Respect user preferences

---

## Browser Support

✅ Chrome/Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Mobile browsers  
✅ Dark mode support

---

## Testing Checklist

- [ ] All pages render
- [ ] Dark mode works
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] Forms submit
- [ ] No console errors
- [ ] Performance good
- [ ] Accessibility OK

---

**More Examples**
Check component files in `src/components/premium/` for full implementations and JSDoc documentation.

---

**Version**: 1.0.0  
**Updated**: February 2026
