# PixeSci Marketing Landing Page - Design Guidelines

## Brand Identity & Color System

**Primary Palette:**
- Primary: Deep scientific blue (#1e3a8a)
- Secondary: Bright cyan/teal (#06b6d4)
- Accent: Electric blue (#3b82f6)
- Background: Clean white (#ffffff) with subtle gray sections (#f8fafc)
- Text: Dark gray (#1f2937) for body, white for CTAs
- Success/CTA: Vibrant green (#10b981)

**Visual Style:** Modern, clean, scientific aesthetic with subtle gradients and professional imagery

## Layout System

**Spacing:** Use Tailwind's spacing scale focused on units of 4, 8, 12, 16, 20, and 32 for consistent vertical rhythm
- Section padding: py-16 to py-32 for desktop, py-12 to py-20 for mobile
- Component spacing: gap-8 to gap-12 for grids
- Content max-width: max-w-7xl for full sections, max-w-4xl for text-focused content

**Grid Strategy:**
- Hero: Single column centered layout
- Tool Grid: 3-4 columns on desktop (grid-cols-3 lg:grid-cols-4), single column mobile
- Features: 2-3 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Testimonials: 1-3 columns (grid-cols-1 md:grid-cols-3)
- Story Cards: 1-3 columns (grid-cols-1 md:grid-cols-3)

## Typography

**Font Stack:** Modern sans-serif via Google Fonts (Inter or similar system font)
- Hero Headline: text-5xl to text-7xl, font-bold, leading-tight
- Section Headings: text-3xl to text-4xl, font-bold
- Subheadings: text-xl to text-2xl, font-semibold
- Body Text: text-base to text-lg, leading-relaxed
- CTAs: text-lg, font-semibold

## Component Library

### Hero Section
Split-screen animation showing frustrated researcher (left, grayscale) vs PixeSci user (right, colorful). Centered headline/subheadline with two CTAs (primary green "Join the Waitlist", secondary outline "Watch 60-Second Demo"). Floating scientific tool icons with subtle parallax motion. Full viewport height (min-h-screen).

### Problem Section
5 pain point cards in vertical or 2-column layout, each with large emoji icon, bold problem statement, and brief description. Dark background (#1f2937) with white text for contrast. Transition statement centered below.

### Interactive Demo
Chat-style interface centerpiece with 4 clickable example prompts. Animated result visualization showing AI workflow execution. Three benefit callouts with checkmark icons positioned around or below demo. Light background with card elevation.

### Tool Integration Showcase
Grid of 12+ tool logos with hover scale animations. Logos in grayscale by default, color on hover. Clean spacing between items. Centered tagline below grid.

### User Stories
Three hoverable cards with before/after format. Photo placeholder at top, role/institution subtitle, quote-style text. Hover reveals expanded content or color shift. Equal height cards with consistent padding.

### Features Grid
Six feature blocks, each with large icon, bold title, and description. Icons use brand colors (blue/cyan gradient). Balanced spacing, possibly in 2x3 or 3x2 grid.

### Testimonials
Three cards with quote text, attribution line (name, role, institution). Subtle background differentiation. Optional avatar placeholders. Centered or left-aligned text.

### Early Access Benefits
Five benefit items with icons, each highlighting exclusive perk. Urgency counter "Only 200 spots available" prominently displayed. Gradient background section for emphasis.

### Waitlist Form
Clean, modern form with inline validation. Fields: email, name, institution (text), research area (dropdown with 8+ options), software checkboxes (10+ tools), challenge text area. Large green CTA button "Secure My Early Access". Progress indicator during submission. Success animation with checkmark on completion. Social proof counter below: "Join 1,247 researchers already on the waitlist".

### FAQ Section
Expandable accordion items with question in bold, answer revealed on click. Smooth expand/collapse animation. 5 questions covering installation, workflows, security, pricing, availability.

### Footer
Simple centered layout with PixeSci logo, tagline "Making science software simple", contact email, policy links, and small final CTA button.

## Animations & Interactions

**Micro-Animations:**
- Button hover: subtle scale (scale-105) and brightness increase
- Card hover: elevation shadow increase, slight translate-y lift
- Scroll-triggered fade-ins: opacity 0 to 1 with translateY
- Tool logo hover: scale-110 with color transition
- Form field focus: border color change to accent blue
- CTA pulse: subtle animation on primary buttons

**Performance:** All animations at 60fps, lazy load images, smooth scrolling enabled, mobile-optimized interactions

## Images

**Hero Image:** Split-screen visual concept showing researcher frustration (left side, desaturated) vs PixeSci ease (right side, vibrant colors). This is a large, full-width hero image spanning the viewport.

**Tool Logos:** Use actual scientific software logos (ImageJ, MATLAB, GraphPad Prism, Napari, CellProfiler, Origin, Imaris, FlowJo, R/RStudio, Python/Jupyter, Excel) - source from official sites or use high-quality SVG versions.

**User Story Avatars:** Professional headshot placeholders for three testimonial cards (PhD student, core facility manager, postdoc).

**Background Patterns:** Subtle scientific imagery (DNA helixes, microscopy patterns, molecular structures) as very light opacity overlays in sections.

## Accessibility & Form UX

- WCAG AA contrast ratios maintained throughout
- Form inputs with clear labels, placeholder text, and error states
- Keyboard navigation support for all interactive elements
- Focus indicators on all clickable items
- Screen reader friendly aria labels

## Responsive Behavior

**Mobile-First Design (60% mobile traffic):**
- Single column stacking for all grids below md breakpoint
- Hero text scales down (text-4xl to text-5xl on mobile)
- Form inputs full-width on mobile
- Touch-friendly button sizes (min 44x44px)
- Hamburger menu if navigation added
- Reduced animation complexity on mobile for performance