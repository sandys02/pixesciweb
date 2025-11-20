# PixeSci Marketing Landing Page - Design Guidelines

## Brand Identity & Color System

**Primary Palette:**
- Primary Blue: #2D5AF0 (Vibrant blue for main actions, navigation, branding)
- Secondary Orange: #FF6B2C (Workflow indicators, automation features, secondary actions)
- Success Green: #10B981 (High confidence, successful operations, completed tasks)
- Error Red: #EF4444 (Low confidence, error messages, failed operations)
- Warning Yellow: #F59E0B (Medium confidence, cautions, warnings)
- Info Blue: #3B82F6 (Informational messages, help text, tips)

**Dark Mode (Default):**
- Background: #0F1117 (Almost black)
- Paper/Card: #1A1D25 (Elevated surface)
- Elevated: #242832 (Cards, popups, hover states)
- Text Primary: #FFFFFF (White)
- Text Secondary: #B0B0B0 (Light gray)
- Divider: rgba(255,255,255,0.12) (12% white)

**Light Mode:**
- Background: #FAFAFA (Off-white)
- Paper/Card: #FFFFFF (Pure white)
- Elevated: #F5F5F5 (Light gray)
- Text Primary: #1A202C (Dark gray)
- Text Secondary: #718096 (Medium gray)
- Divider: rgba(0,0,0,0.08) (8% black)

**Visual Style:** Professional, enterprise-ready design optimized for scientific software with excellent contrast and accessibility

## Typography System

**Font Family:**
'Inter var', Inter, system-ui, -apple-system, sans-serif

**Type Scale (600 weight for headings, 400 weight for body):**
- H1: 2.5rem (40px) - Large headings
- H2: 2rem (32px) - Page titles
- H3: 1.75rem (28px) - Section headings
- H4: 1.5rem (24px) - Subsections
- H5: 1.25rem (20px) - Card titles
- H6: 1.125rem (18px) - Small headings
- Body1: 1rem (16px) - Main text
- Body2: 0.875rem (14px) - Secondary text
- Button: 0.875rem (14px) - Button text (600 weight)
- Caption: 0.75rem (12px) - Hints and captions

**Tailwind Classes:**
- Hero Headline: text-4xl md:text-5xl font-semibold
- Section Headings: text-3xl md:text-4xl font-bold
- Subheadings: text-xl md:text-2xl font-semibold
- Body Text: text-base leading-relaxed
- CTAs: text-sm font-semibold

## Design Tokens

**Border Radius:**
- sm: 8px (Small - inputs, buttons)
- md: 12px (Medium - cards, default)
- lg: 16px (Large - modals, containers)
- pill: 999px (Circular - chips, badges)

**Spacing Scale (8px grid):**
- 0: 0px
- 1: 4px
- 2: 8px
- 3: 12px
- 4: 16px
- 5: 24px
- 6: 32px
- 7: 48px

**Layout System:**
- Section padding: py-12 to py-20 (48-80px)
- Component spacing: gap-4 to gap-8 (16-32px)
- Content max-width: max-w-7xl for full sections, max-w-4xl for text-focused content

**Grid Strategy:**
- Hero: Single column centered layout
- Tool Grid: 3-4 columns on desktop (grid-cols-3 lg:grid-cols-4), single column mobile
- Features: 2-3 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Testimonials: 1-3 columns (grid-cols-1 md:grid-cols-3)

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

**Motion/Animation:**
- Standard: cubic-bezier(0.4, 0, 0.2, 1) - 500ms
- Fast: cubic-bezier(0.4, 0, 1, 1) - 150ms

**Micro-Animations:**
- Button hover: subtle translateY(-2px) with elevation shadow
- Card hover: box-shadow increase with slight lift
- Scroll-triggered fade-ins: opacity 0 to 1 with translateY
- Tool logo hover: scale-105 with color transition
- Form field focus: border color change to primary blue
- Hover effects: transform: translateY(-2px) with box-shadow

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